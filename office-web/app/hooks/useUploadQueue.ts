"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MAX_FILE_BYTES,
  MAX_FILES_PER_BATCH,
  ProjectFileUpload,
  requestProjectFileUploads,
} from "@/app/lib/api/office-api/project-files/request-uploads";
import {
  confirmProjectFileUploads,
  UploadedFile,
} from "@/app/lib/api/office-api/project-files/confirm-uploads";
import { relativeFolderOf, uploadToStorage } from "@/app/lib/upload-to-storage";

// Files sent to storage at the same time
const UPLOAD_CONCURRENCY = 3;

export type UploadStatus =
  | "waiting"
  | "uploading"
  | "saving"
  | "done"
  | "error"
  | "canceled";

export interface QueuedUpload {
  id: string;
  file: File;
  // Subfolders to create under the target, from a folder upload
  relative_path: string;
  // Target folder; null = root of the project
  folder_id: string | null;
  status: UploadStatus;
  // 0-100 while uploading
  progress: number;
  error?: string;
}

interface UseUploadQueueOptions {
  project_id: string;
  access_token: string | undefined;
  // Called after each batch is saved, to refresh the file list
  onSaved: () => void;
}

let nextId = 0;

// Batch upload: asks the API for presigned URLs (up to 100 files per call),
// PUTs the files straight to storage a few at a time, then confirms the ones
// that made it. Failed files can be retried; canceling keeps what finished.
export default function useUploadQueue({
  project_id,
  access_token,
  onSaved,
}: UseUploadQueueOptions) {
  const [items, setItems] = useState<QueuedUpload[]>([]);
  const abortController = useRef(new AbortController());
  const onSavedRef = useRef(onSaved);
  onSavedRef.current = onSaved;

  const patch = useCallback(
    (ids: string[], changes: Partial<QueuedUpload>) =>
      setItems((current) =>
        current.map((item) =>
          ids.includes(item.id) ? { ...item, ...changes } : item
        )
      ),
    []
  );

  const runChunk = useCallback(
    async (chunk: QueuedUpload[], signal: AbortSignal) => {
      if (!access_token || signal.aborted) return;

      const ids = chunk.map((item) => item.id);
      const infos = chunk.map((item) => ({
        name: item.file.name,
        size: item.file.size,
        content_type: item.file.type,
        relative_path: item.relative_path || undefined,
      }));

      let uploads: ProjectFileUpload[];
      try {
        uploads = await requestProjectFileUploads(
          project_id,
          infos,
          access_token
        );
      } catch (err) {
        patch(ids, { status: "error", error: "Não foi possível iniciar." });
        return;
      }

      const uploaded: UploadedFile[] = [];
      const uploadedIds: string[] = [];
      let cursor = 0;

      const worker = async () => {
        while (cursor < chunk.length && !signal.aborted) {
          const index = cursor++;
          const item = chunk[index];
          const upload = uploads[index];

          patch([item.id], { status: "uploading", progress: 0 });

          try {
            await uploadToStorage(
              upload.url,
              item.file,
              upload.content_type,
              (progress) => patch([item.id], { progress }),
              signal
            );
            uploaded.push({
              ...infos[index],
              content_type: upload.content_type,
              key: upload.key,
            });
            uploadedIds.push(item.id);
            patch([item.id], { status: "saving", progress: 100 });
          } catch (err: Error | any) {
            patch(
              [item.id],
              err?.name === "AbortError"
                ? { status: "canceled" }
                : { status: "error", error: "Falha no envio." }
            );
          }
        }
      };

      await Promise.all(
        Array.from({ length: UPLOAD_CONCURRENCY }, () => worker())
      );

      // Files never started because of a cancel
      const startedIds = new Set(chunk.slice(0, cursor).map((item) => item.id));
      patch(
        ids.filter((id) => !startedIds.has(id)),
        { status: "canceled" }
      );

      if (uploaded.length === 0) return;

      // Saved even after a cancel: these files are already in storage
      try {
        await confirmProjectFileUploads(
          project_id,
          chunk[0].folder_id,
          uploaded,
          access_token
        );
        patch(uploadedIds, { status: "done" });
        onSavedRef.current();
      } catch (err) {
        patch(uploadedIds, {
          status: "error",
          error: "Não foi possível salvar.",
        });
      }
    },
    [access_token, patch, project_id]
  );

  // Every item of a run shares its target folder
  const run = useCallback(
    async (queued: QueuedUpload[]) => {
      const signal = abortController.current.signal;

      for (let i = 0; i < queued.length; i += MAX_FILES_PER_BATCH) {
        await runChunk(queued.slice(i, i + MAX_FILES_PER_BATCH), signal);
      }
    },
    [runChunk]
  );

  const add = useCallback(
    (files: File[], folder_id: string | null) => {
      if (abortController.current.signal.aborted) {
        abortController.current = new AbortController();
      }

      const queued: QueuedUpload[] = files.map((file) => {
        const tooBig = file.size > MAX_FILE_BYTES;
        return {
          id: `upload-${nextId++}`,
          file,
          relative_path: relativeFolderOf(file),
          folder_id,
          status: tooBig ? "error" : "waiting",
          progress: 0,
          error: tooBig ? "Maior que 5 GB." : undefined,
        };
      });

      setItems((current) => [...current, ...queued]);
      run(queued.filter((item) => item.status === "waiting"));
    },
    [run]
  );

  const retryFailed = useCallback(() => {
    if (abortController.current.signal.aborted) {
      abortController.current = new AbortController();
    }

    const failed = items.filter(
      (item) => item.status === "error" && item.file.size <= MAX_FILE_BYTES
    );
    patch(
      failed.map((item) => item.id),
      { status: "waiting", progress: 0, error: undefined }
    );

    // Retried files keep their own target folder
    const byFolder = new Map<string | null, QueuedUpload[]>();
    failed.forEach((item) =>
      byFolder.set(item.folder_id, [
        ...(byFolder.get(item.folder_id) ?? []),
        item,
      ])
    );
    byFolder.forEach((group) => run(group));
  }, [items, patch, run]);

  const cancelAll = useCallback(() => {
    abortController.current.abort();
  }, []);

  const clear = useCallback(() => {
    setItems((current) =>
      current.filter((item) =>
        ["waiting", "uploading", "saving"].includes(item.status)
      )
    );
  }, []);

  const isBusy = items.some((item) =>
    ["waiting", "uploading", "saving"].includes(item.status)
  );

  // Leaving the page would drop the uploads still running
  useEffect(() => {
    if (!isBusy) return;

    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [isBusy]);

  return { items, add, retryFailed, cancelAll, clear, isBusy };
}

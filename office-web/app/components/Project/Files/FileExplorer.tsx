"use client";

import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
  MdCreateNewFolder,
  MdDelete,
  MdDownload,
  MdDriveFileMove,
  MdEdit,
  MdFilterList,
  MdFolder,
  MdHome,
  MdImage,
  MdInsertDriveFile,
  MdMoreVert,
  MdPictureAsPdf,
  MdUploadFile,
  MdDriveFolderUpload,
} from "react-icons/md";
import { Modal } from "@/app/components/Modal";
import { ConfirmRemoval } from "@/app/components/ConfirmRemoval";
import FilterSelect from "@/app/components/FilterSelect";
import EditProjectFileForm from "@/app/components/Project/EditProjectFileForm";
import useUser from "@/app/hooks/useUser";
import useUploadQueue from "@/app/hooks/useUploadQueue";
import { Category } from "@/app/lib/api/office-api/categories/dtos";
import { ProjectFile } from "@/app/lib/api/office-api/projects/dtos";
import { ProjectFolder } from "@/app/lib/api/office-api/project-folders/dtos";
import { createProjectFolder } from "@/app/lib/api/office-api/project-folders/create-project-folder";
import { updateProjectFolder } from "@/app/lib/api/office-api/project-folders/update-project-folder";
import { deleteProjectFolder } from "@/app/lib/api/office-api/project-folders/delete-project-folder";
import { deleteProjectFile } from "@/app/lib/api/office-api/project-files/delete-project-file";
import { moveProjectFiles } from "@/app/lib/api/office-api/project-files/move-project-files";
import FolderForm, { FolderFormValues } from "./FolderForm";
import MoveForm from "./MoveForm";
import UploadPanel from "./UploadPanel";
import {
  childFolders,
  folderLabel,
  folderPath,
  folderWithDescendants,
  formatBytes,
} from "./folder-tree";

type ExplorerFile = Omit<ProjectFile, "created_at"> & { created_at: Date };

type DialogState =
  | { type: "new-folder" }
  | { type: "edit-folder"; folder: ProjectFolder }
  | { type: "move-folder"; folder: ProjectFolder }
  | { type: "delete-folder"; folder: ProjectFolder }
  | { type: "edit-file"; file: ExplorerFile }
  | { type: "move-files"; files: ExplorerFile[] }
  | { type: "delete-files"; files: ExplorerFile[] }
  // Action sheet for touch screens, where row buttons don't fit
  | { type: "folder-actions"; folder: ProjectFolder }
  | { type: "file-actions"; file: ExplorerFile }
  | null;

interface FileExplorerProps {
  project_id: string;
  files: ExplorerFile[];
  folders: ProjectFolder[];
  categories: Category[];
  // The project's steps, as options (value = ProjectStep id)
  stepOptions: { value: string; label: string }[];
  // Step filter is controlled so "Ver arquivos" on a step can set it
  stepFilter: string;
  // eslint-disable-next-line no-unused-vars
  onStepFilterChange: (value: string) => void;
  // Reloads the project's files and folders
  onChanged: () => Promise<void>;
  // eslint-disable-next-line no-unused-vars
  showToast: (title: string, text: string, type: "success" | "error") => void;
}

function FileIcon({ file }: { file: ExplorerFile }) {
  const type = file.content_type ?? "";
  if (type.startsWith("image/"))
    return <MdImage size={24} className="text-green-500 shrink-0" />;
  if (type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))
    return <MdPictureAsPdf size={24} className="text-red-400 shrink-0" />;
  return <MdInsertDriveFile size={24} className="text-gray-400 shrink-0" />;
}

const iconButton =
  "p-2 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-blue-500 transition-colors";

// Drive-like view of a project's files: folders of any depth, batch upload
// (files or whole folders, picked or dropped) and moving things around.
// Category and step filters search every folder at once.
export default function FileExplorer({
  project_id,
  files,
  folders,
  categories,
  stepOptions,
  stepFilter,
  onStepFilterChange,
  onChanged,
  showToast,
}: FileExplorerProps) {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The open folder lives in the URL so the back button works
  const folderParam = searchParams.get("folder");
  const currentFolder = folders.find((folder) => folder.id === folderParam);
  const currentFolderId = currentFolder?.id ?? null;

  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState<"name" | "recent" | "oldest">("name");
  const [showFilters, setShowFilters] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<DialogState>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstFolder = useRef(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const folderInput = useRef<HTMLInputElement>(null);

  const uploads = useUploadQueue({
    project_id,
    access_token: user?.access_token,
    onSaved: onChanged,
  });

  // React doesn't know the folder picker attributes
  useEffect(() => {
    folderInput.current?.setAttribute("webkitdirectory", "");
    folderInput.current?.setAttribute("directory", "");
  }, []);

  useEffect(() => {
    // Selection belongs to the folder being shown
    setSelected(new Set());

    // router.push scrolls the page to the top; bring the explorer back.
    // Deferred so it runs after Next's own scroll.
    if (isFirstFolder.current) {
      isFirstFolder.current = false;
      return;
    }
    const timer = setTimeout(() =>
      rootRef.current?.scrollIntoView({ block: "start" })
    );
    return () => clearTimeout(timer);
  }, [currentFolderId]);

  const openFolder = (folder_id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (folder_id) params.set("folder", folder_id);
    else params.delete("folder");
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  };

  const isFiltering = !!categoryFilter || !!stepFilter;
  const matchesFilter = (filter: string, value: string | null) =>
    !filter || (filter === "none" ? !value : value === filter);

  const sortFiles = (list: ExplorerFile[]) =>
    [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
      const byDate = b.created_at.getTime() - a.created_at.getTime();
      return sort === "oldest" ? -byDate : byDate;
    });

  // Filtering searches every folder; otherwise show the open folder only
  const visibleFiles = sortFiles(
    isFiltering
      ? files.filter(
          (file) =>
            matchesFilter(categoryFilter, file.category_id) &&
            matchesFilter(stepFilter, file.project_step_id)
        )
      : files.filter((file) => file.folder_id === currentFolderId)
  );
  const visibleFolders = isFiltering
    ? []
    : childFolders(folders, currentFolderId);

  // Files anywhere under each folder, for counts and delete warnings
  const fileCountUnder = useMemo(() => {
    const counts = new Map<string, number>();
    folders.forEach((folder) => {
      const ids = folderWithDescendants(folders, folder.id);
      counts.set(
        folder.id,
        files.filter((file) => file.folder_id && ids.has(file.folder_id)).length
      );
    });
    return counts;
  }, [files, folders]);

  const tagLabel = (category_id: string | null, step_id: string | null) =>
    [
      categories.find((category) => category.id === category_id)?.name,
      stepOptions.find((option) => option.value === step_id)?.label,
    ]
      .filter(Boolean)
      .join(" · ");

  const startUpload = (picked: File[]) => {
    if (picked.length > 0) uploads.add(picked, currentFolderId);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
    noClick: true,
    noKeyboard: true,
  });

  const closeDialog = () => setDialog(null);

  const run = async (action: () => Promise<void>, success: string) => {
    try {
      await action();
      closeDialog();
      setSelected(new Set());
      showToast("Sucesso!", success, "success");
      await onChanged();
    } catch (err: Error | any) {
      showToast("Oops!", err.message || "Algo deu errado.", "error");
    }
  };

  const folderErrorMessage = (err: Error | any) =>
    err.message === "A folder with this name already exists."
      ? "Já existe uma pasta com esse nome aqui."
      : "Erro ao salvar a pasta.";

  const handleCreateFolder = async (values: FolderFormValues) => {
    if (!user) return;
    try {
      await createProjectFolder(
        { project_id, parent_id: currentFolderId, ...values },
        user.access_token
      );
    } catch (err) {
      throw new Error(folderErrorMessage(err));
    }
    closeDialog();
    await onChanged();
  };

  const handleEditFolder =
    (folder: ProjectFolder) => async (values: FolderFormValues) => {
      if (!user) return;
      try {
        await updateProjectFolder(folder.id, values, user.access_token);
      } catch (err) {
        throw new Error(folderErrorMessage(err));
      }
      closeDialog();
      await onChanged();
    };

  const handleMoveFolder =
    (folder: ProjectFolder) => (parent_id: string | null) =>
      run(async () => {
        if (!user) return;
        try {
          await updateProjectFolder(
            folder.id,
            { parent_id },
            user.access_token
          );
        } catch (err) {
          throw new Error(folderErrorMessage(err));
        }
      }, "Pasta movida.");

  const handleDeleteFolder = (folder: ProjectFolder) =>
    run(async () => {
      if (!user) return;
      await deleteProjectFolder(folder.id, user.access_token);
      // Deleting the open folder (or a parent of it) goes up a level
      if (
        currentFolderId &&
        folderWithDescendants(folders, folder.id).has(currentFolderId)
      ) {
        openFolder(folder.parent_id);
      }
    }, "Pasta excluída.");

  const handleMoveFiles =
    (moved: ExplorerFile[]) => (folder_id: string | null) =>
      run(
        async () => {
          if (!user) return;
          await moveProjectFiles(
            moved.map((file) => file.id),
            folder_id,
            user.access_token
          );
        },
        moved.length === 1 ? "Arquivo movido." : "Arquivos movidos."
      );

  const handleDeleteFiles = (removed: ExplorerFile[]) =>
    run(
      async () => {
        if (!user) return;
        for (const file of removed) {
          await deleteProjectFile(file.id, user.access_token);
        }
      },
      removed.length === 1 ? "Arquivo excluído." : "Arquivos excluídos."
    );

  const toggleSelected = (file_id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(file_id)) next.delete(file_id);
      else next.add(file_id);
      return next;
    });

  const selectedFiles = visibleFiles.filter((file) => selected.has(file.id));
  const path = folderPath(folders, currentFolderId);

  const dialogContent = (): {
    title: string;
    description: string;
    content: ReactElement;
  } | null => {
    if (!dialog) return null;

    switch (dialog.type) {
      case "new-folder":
        return {
          title: "Nova pasta",
          description: `Em ${folderLabel(folders, currentFolderId)}`,
          content: (
            <FolderForm
              categories={categories}
              stepOptions={stepOptions}
              onSubmit={handleCreateFolder}
            />
          ),
        };
      case "edit-folder":
        return {
          title: "Editar pasta",
          description: "Renomeie a pasta ou mude as etiquetas padrão dela.",
          content: (
            <FolderForm
              folder={dialog.folder}
              categories={categories}
              stepOptions={stepOptions}
              onSubmit={handleEditFolder(dialog.folder)}
            />
          ),
        };
      case "move-folder":
        return {
          title: `Mover ${dialog.folder.name}`,
          description: "Escolha a pasta de destino.",
          content: (
            <MoveForm
              folders={folders}
              currentFolderId={dialog.folder.parent_id}
              blockedIds={folderWithDescendants(folders, dialog.folder.id)}
              onMove={handleMoveFolder(dialog.folder)}
            />
          ),
        };
      case "delete-folder": {
        const subfolders =
          folderWithDescendants(folders, dialog.folder.id).size - 1;
        const fileCount = fileCountUnder.get(dialog.folder.id) ?? 0;
        return {
          title: `Excluir ${dialog.folder.name}?`,
          description:
            subfolders + fileCount > 0
              ? `Esta pasta tem ${subfolders} subpasta(s) e ${fileCount} arquivo(s). Tudo será apagado.`
              : "A pasta está vazia.",
          content: (
            <ConfirmRemoval
              message="Essa ação não pode ser desfeita."
              onConfirm={() => handleDeleteFolder(dialog.folder)}
              onCancel={closeDialog}
            />
          ),
        };
      }
      case "edit-file":
        return {
          title: `Editar ${dialog.file.name}`,
          description: "Altere a categoria e a etapa do arquivo.",
          content: (
            <EditProjectFileForm
              file={dialog.file as unknown as ProjectFile}
              categories={categories}
              stepOptions={stepOptions}
              onSaved={async () => {
                closeDialog();
                showToast("Sucesso!", "Arquivo atualizado.", "success");
                await onChanged();
              }}
              onError={(message) => showToast("Oops!", message, "error")}
            />
          ),
        };
      case "move-files":
        return {
          title:
            dialog.files.length === 1
              ? `Mover ${dialog.files[0].name}`
              : `Mover ${dialog.files.length} arquivos`,
          description: "Escolha a pasta de destino.",
          content: (
            <MoveForm
              folders={folders}
              // Files from several folders (a filtered view) can go anywhere
              currentFolderId={
                dialog.files.every(
                  (file) => file.folder_id === dialog.files[0].folder_id
                )
                  ? dialog.files[0].folder_id
                  : undefined
              }
              onMove={handleMoveFiles(dialog.files)}
            />
          ),
        };
      case "delete-files":
        return {
          title:
            dialog.files.length === 1
              ? `Excluir ${dialog.files[0].name}?`
              : `Excluir ${dialog.files.length} arquivos?`,
          description: "Os arquivos são apagados do armazenamento.",
          content: (
            <ConfirmRemoval
              message="Essa ação não pode ser desfeita."
              onConfirm={() => handleDeleteFiles(dialog.files)}
              onCancel={closeDialog}
            />
          ),
        };
      case "folder-actions":
        return {
          title: dialog.folder.name,
          description: "O que você quer fazer com esta pasta?",
          content: (
            <ActionList
              actions={[
                {
                  label: "Editar pasta",
                  icon: <MdEdit size={22} />,
                  onClick: () =>
                    setDialog({ type: "edit-folder", folder: dialog.folder }),
                },
                {
                  label: "Mover",
                  icon: <MdDriveFileMove size={22} />,
                  onClick: () =>
                    setDialog({ type: "move-folder", folder: dialog.folder }),
                },
                {
                  label: "Excluir",
                  icon: <MdDelete size={22} />,
                  danger: true,
                  onClick: () =>
                    setDialog({ type: "delete-folder", folder: dialog.folder }),
                },
              ]}
            />
          ),
        };
      case "file-actions":
        return {
          title: dialog.file.name,
          description: "O que você quer fazer com este arquivo?",
          content: (
            <ActionList
              actions={[
                ...(dialog.file.path
                  ? [
                      {
                        label: "Abrir / baixar",
                        icon: <MdDownload size={22} />,
                        href: dialog.file.path,
                      },
                    ]
                  : []),
                {
                  label: "Editar etiquetas",
                  icon: <MdEdit size={22} />,
                  onClick: () =>
                    setDialog({ type: "edit-file", file: dialog.file }),
                },
                {
                  label: "Mover",
                  icon: <MdDriveFileMove size={22} />,
                  onClick: () =>
                    setDialog({ type: "move-files", files: [dialog.file] }),
                },
                {
                  label: "Excluir",
                  icon: <MdDelete size={22} />,
                  danger: true,
                  onClick: () =>
                    setDialog({ type: "delete-files", files: [dialog.file] }),
                },
              ]}
            />
          ),
        };
    }
  };

  const openDialog = dialogContent();
  const activeFilters = [categoryFilter, stepFilter].filter(Boolean).length;

  return (
    <div ref={rootRef} className="flex flex-col gap-4 mt-4 scroll-mt-4">
      {/* Breadcrumb: scrolls sideways instead of wrapping on phones */}
      {!isFiltering && (
        <nav className="flex items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
          <button
            type="button"
            onClick={() => openFolder(null)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-200 ${
              path.length === 0
                ? "font-semibold text-gray-700"
                : "text-blue-500"
            }`}
          >
            <MdHome size={18} />
            Arquivos
          </button>
          {path.map((folder, index) => (
            <span key={folder.id} className="flex items-center gap-1">
              <span className="text-gray-400">›</span>
              <button
                type="button"
                onClick={() => openFolder(folder.id)}
                className={`px-2 py-1 rounded-lg hover:bg-gray-200 ${
                  index === path.length - 1
                    ? "font-semibold text-gray-700"
                    : "text-blue-500"
                }`}
              >
                {folder.name}
              </button>
            </span>
          ))}
        </nav>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-500 text-gray-100 rounded-lg px-4 py-3 font-title text-sm hover:opacity-90"
        >
          <MdUploadFile size={20} />
          Enviar arquivos
        </button>
        <button
          type="button"
          onClick={() => folderInput.current?.click()}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-blue-500 text-blue-500 rounded-lg px-4 py-3 font-title text-sm hover:bg-blue-50"
        >
          <MdDriveFolderUpload size={20} />
          Enviar pasta
        </button>
        <button
          type="button"
          onClick={() => setDialog({ type: "new-folder" })}
          disabled={isFiltering}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 border border-gray-300 text-gray-600 rounded-lg px-4 py-3 font-title text-sm hover:bg-gray-200 disabled:opacity-40"
        >
          <MdCreateNewFolder size={20} />
          Nova pasta
        </button>
        <button
          type="button"
          onClick={() => setShowFilters((shown) => !shown)}
          className={`md:hidden flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm border ${
            activeFilters > 0
              ? "border-blue-500 text-blue-500"
              : "border-gray-300 text-gray-600"
          }`}
        >
          <MdFilterList size={20} />
          Filtros{activeFilters > 0 && ` (${activeFilters})`}
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            startUpload(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <input
          ref={folderInput}
          type="file"
          multiple
          hidden
          onChange={(event) => {
            startUpload(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
      </div>

      <div
        className={`${
          showFilters ? "flex" : "hidden"
        } md:flex flex-col sm:flex-row gap-3 sm:items-end flex-wrap`}
      >
        <FilterSelect
          label="Categoria"
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={[
            { value: "", label: "Todas as categorias" },
            ...categories.map((category) => ({
              value: category.id,
              label: category.name,
            })),
            { value: "none", label: "Sem categoria" },
          ]}
        />
        <FilterSelect
          label="Etapa"
          value={stepFilter}
          onChange={onStepFilterChange}
          options={[
            { value: "", label: "Todas as etapas" },
            ...stepOptions,
            { value: "none", label: "Sem etapa" },
          ]}
        />
        <FilterSelect
          label="Ordenar por"
          value={sort}
          onChange={(value) => setSort(value as typeof sort)}
          options={[
            { value: "name", label: "Nome (A-Z)" },
            { value: "recent", label: "Mais recentes" },
            { value: "oldest", label: "Mais antigos" },
          ]}
        />
      </div>

      {isFiltering && (
        <div className="flex flex-wrap gap-3 items-center bg-blue-50 text-blue-900 rounded-lg px-4 py-3 text-sm">
          <p className="flex-1 min-w-[12rem]">
            {visibleFiles.length} arquivo(s) em todas as pastas com esses
            filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter("");
              onStepFilterChange("");
            }}
            className="text-blue-500 font-semibold"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {/* Floats over the page so selecting doesn't shift the rows */}
      {selectedFiles.length > 0 && (
        <div className="fixed z-30 top-[max(1rem,env(safe-area-inset-top))] inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:min-w-[28rem] flex flex-wrap items-center gap-2 bg-blue-500 text-gray-100 rounded-xl px-4 py-2 text-sm shadow-xl">
          <p className="flex-1 font-semibold">
            {selectedFiles.length} selecionado(s)
          </p>
          <button
            type="button"
            onClick={() =>
              setDialog({ type: "move-files", files: selectedFiles })
            }
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-600"
          >
            <MdDriveFileMove size={18} /> Mover
          </button>
          <button
            type="button"
            onClick={() =>
              setDialog({ type: "delete-files", files: selectedFiles })
            }
            className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-blue-600"
          >
            <MdDelete size={18} /> Excluir
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="px-3 py-2 rounded-lg hover:bg-blue-600"
          >
            Limpar
          </button>
        </div>
      )}

      {/* The whole list takes dropped files and folders */}
      <div
        {...getRootProps()}
        className={`relative rounded-lg border-2 transition-colors min-h-[10rem] ${
          isDragActive
            ? "border-blue-500 border-dashed bg-blue-50"
            : "border-transparent"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive && (
          <p className="absolute inset-0 grid place-items-center text-blue-500 font-semibold pointer-events-none">
            Solte para enviar para {folderLabel(folders, currentFolderId)}
          </p>
        )}

        {visibleFolders.length === 0 && visibleFiles.length === 0 ? (
          <p className="text-gray-500 text-center py-10 px-4">
            {isFiltering
              ? "Nenhum arquivo com esses filtros."
              : "Pasta vazia. Arraste arquivos ou pastas para cá, ou use os botões acima."}
          </p>
        ) : (
          <ul className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm">
            {visibleFolders.map((folder) => {
              const tags = tagLabel(folder.category_id, folder.project_step_id);
              const count = fileCountUnder.get(folder.id) ?? 0;
              return (
                <li key={folder.id} className="flex items-center gap-1 pr-1">
                  <button
                    type="button"
                    onClick={() => openFolder(folder.id)}
                    className="flex-1 min-w-0 flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg"
                  >
                    <MdFolder size={28} className="text-blue-400 shrink-0" />
                    <span className="min-w-0">
                      <span className="block font-semibold truncate">
                        {folder.name}
                      </span>
                      <span className="block text-xs text-gray-500 truncate">
                        {count} arquivo(s)
                        {tags && ` · ${tags}`}
                      </span>
                    </span>
                  </button>
                  <div className="hidden md:flex items-center">
                    <button
                      type="button"
                      aria-label={`Editar pasta ${folder.name}`}
                      onClick={() => setDialog({ type: "edit-folder", folder })}
                      className={iconButton}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Mover pasta ${folder.name}`}
                      onClick={() => setDialog({ type: "move-folder", folder })}
                      className={iconButton}
                    >
                      <MdDriveFileMove size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Excluir pasta ${folder.name}`}
                      onClick={() =>
                        setDialog({ type: "delete-folder", folder })
                      }
                      className={`${iconButton} hover:text-red-400`}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Ações da pasta ${folder.name}`}
                    onClick={() =>
                      setDialog({ type: "folder-actions", folder })
                    }
                    className={`md:hidden ${iconButton}`}
                  >
                    <MdMoreVert size={24} />
                  </button>
                </li>
              );
            })}

            {visibleFiles.map((file) => {
              const tags = tagLabel(file.category_id, file.project_step_id);
              return (
                <li key={file.id} className="flex items-center gap-1 pr-1">
                  <label className="pl-3 py-3 flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.has(file.id)}
                      onChange={() => toggleSelected(file.id)}
                      aria-label={`Selecionar ${file.name}`}
                      className="w-5 h-5 accent-blue-500"
                    />
                  </label>
                  <a
                    href={file.path ?? undefined}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-0 flex items-center gap-3 px-2 py-3 hover:bg-gray-50 rounded-lg"
                  >
                    <FileIcon file={file} />
                    <span className="min-w-0">
                      <span className="block truncate" title={file.name}>
                        {file.name}
                      </span>
                      <span className="block text-xs text-gray-500 truncate">
                        {isFiltering &&
                          `${folderLabel(folders, file.folder_id)} · `}
                        {file.size !== null && `${formatBytes(file.size)} · `}
                        {file.created_by.name},{" "}
                        {formatDistance(file.created_at, Date.now(), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                        {tags && ` · ${tags}`}
                      </span>
                    </span>
                  </a>
                  <div className="hidden md:flex items-center">
                    {file.path && (
                      <a
                        href={file.path}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Baixar ${file.name}`}
                        className={iconButton}
                      >
                        <MdDownload size={20} />
                      </a>
                    )}
                    <button
                      type="button"
                      aria-label={`Editar ${file.name}`}
                      onClick={() => setDialog({ type: "edit-file", file })}
                      className={iconButton}
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Mover ${file.name}`}
                      onClick={() =>
                        setDialog({ type: "move-files", files: [file] })
                      }
                      className={iconButton}
                    >
                      <MdDriveFileMove size={20} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Excluir ${file.name}`}
                      onClick={() =>
                        setDialog({ type: "delete-files", files: [file] })
                      }
                      className={`${iconButton} hover:text-red-400`}
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Ações de ${file.name}`}
                    onClick={() => setDialog({ type: "file-actions", file })}
                    className={`md:hidden ${iconButton}`}
                  >
                    <MdMoreVert size={24} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {openDialog && (
        <Modal
          open
          onOpenChange={(open) => !open && closeDialog()}
          title={
            <strong className="text-xl md:text-2xl font-title break-all">
              {openDialog.title}
            </strong>
          }
          description={openDialog.description}
          content={openDialog.content}
        />
      )}

      <UploadPanel
        items={uploads.items}
        isBusy={uploads.isBusy}
        onRetry={uploads.retryFailed}
        onCancel={uploads.cancelAll}
        onClose={uploads.clear}
      />
    </div>
  );
}

interface Action {
  label: string;
  icon: ReactElement;
  danger?: boolean;
  onClick?: () => void;
  href?: string;
}

// Big touch-friendly buttons for the action sheets
function ActionList({ actions }: { actions: Action[] }) {
  const className = (action: Action) =>
    `w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left text-base hover:bg-gray-200 ${
      action.danger ? "text-red-400" : "text-gray-700"
    }`;

  return (
    <div className="flex flex-col w-full mt-6">
      {actions.map((action) =>
        action.href ? (
          <a
            key={action.label}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className={className(action)}
          >
            {action.icon}
            {action.label}
          </a>
        ) : (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={className(action)}
          >
            {action.icon}
            {action.label}
          </button>
        )
      )}
    </div>
  );
}

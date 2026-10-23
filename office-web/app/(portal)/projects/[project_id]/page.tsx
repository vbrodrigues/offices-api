"use client";

import { useCallback, useRef, useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import LoadingPage from "@/app/(portal)/loading";
import AvatarCircle from "@/app/components/AvatarCircle";
import ProgressBar from "@/app/components/ProgressBar";
import StepStatusSelect from "@/app/components/StepStatusSelect";
import SortableList from "@/app/components/SortableList";
import ProjectStepInfo from "@/app/components/Project/ProjectStepInfo";
import SelectInput from "@/app/components/Form/SelectInput";
import Button from "@/app/components/Button";
import { Modal } from "@/app/components/Modal";
import { ConfirmRemoval } from "@/app/components/ConfirmRemoval";
import { CornerToast } from "@/app/components/Toast/Toast";
import useOfficeData from "@/app/hooks/useOfficeData";
import { useToast } from "@/app/hooks/useToast";
import { findProject } from "@/app/lib/api/office-api/projects/find-project";
import { updateProjectStep } from "@/app/lib/api/office-api/projects/update-project-step";
import { addProjectStep } from "@/app/lib/api/office-api/projects/add-project-step";
import { removeProjectStep } from "@/app/lib/api/office-api/projects/remove-project-step";
import { reorderProjectSteps } from "@/app/lib/api/office-api/projects/reorder-project-steps";
import { listSteps } from "@/app/lib/api/office-api/steps/list-steps";
import { Project, ProjectStep } from "@/app/lib/api/office-api/projects/dtos";
import { Step } from "@/app/lib/api/office-api/steps/dtos";
import { listCategories } from "@/app/lib/api/office-api/categories/list-categories";
import { Category } from "@/app/lib/api/office-api/categories/dtos";
import { deleteProjectFile } from "@/app/lib/api/office-api/project-files/delete-project-file";
import UploadProjectFileForm from "@/app/components/Project/UploadProjectFileForm";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdDelete, MdDownload, MdEdit, MdFolderOpen } from "react-icons/md";
import FilterSelect from "@/app/components/FilterSelect";
import ResponsibleSelect from "@/app/components/Project/ResponsibleSelect";
import EditProjectFileForm from "@/app/components/Project/EditProjectFileForm";
import { listEmployees } from "@/app/lib/api/office-api/employees/list-employees";
import { Employee } from "@/app/lib/api/employees/dtos";
import { shortenString } from "@/app/lib/utils";
import { Dropzone } from "@/app/components/Form/Dropzone";

interface ProjectDetailsPageProps {
  params: {
    project_id: string;
  };
}

interface ProjectDetailsData {
  project: Project | null;
  // All steps of the office, to add to the project
  officeSteps: Step[];
  // File categories of the office, to tag uploads
  categories: Category[];
  // Employees of the office, to pick a step's responsible
  employees: Employee[];
}

const ProjectDetailsPage = ({
  params: { project_id },
}: ProjectDetailsPageProps) => {
  const fetchProjectDetails = useCallback(
    async (access_token: string): Promise<ProjectDetailsData> => {
      const [project, officeSteps, categories, employees] = await Promise.all([
        findProject(access_token, project_id),
        listSteps(access_token),
        listCategories(access_token),
        listEmployees(access_token),
      ]);

      return { project, officeSteps, categories, employees };
    },
    [project_id]
  );

  const {
    user,
    data: { project: projectData, officeSteps, categories, employees },
    setData,
    reload,
    isLoading,
  } = useOfficeData<ProjectDetailsData>(fetchProjectDetails, {
    project: null,
    officeSteps: [],
    categories: [],
    employees: [],
  });

  const {
    showToast,
    setToastOpen,
    toastOpen,
    toastTitle,
    toastText,
    toastType,
  } = useToast();

  // Step being saved, so its select is disabled meanwhile
  const [updatingStepId, setUpdatingStepId] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [stepToAdd, setStepToAdd] = useState<string | null>(null);
  const [stepToRemove, setStepToRemove] = useState<string | null>(null);
  // File dropped and waiting for name/category before being sent
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [fileToRemove, setFileToRemove] = useState<string | null>(null);
  // Remounts the dropzone so it forgets the last file after an upload
  const [dropzoneKey, setDropzoneKey] = useState(0);
  const [fileToEdit, setFileToEdit] = useState<string | null>(null);
  // File list filters: "" = all, "none" = files without one, or an id
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stepFilter, setStepFilter] = useState("");
  const [fileSort, setFileSort] = useState<"recent" | "oldest" | "category">(
    "recent"
  );
  const filesSectionRef = useRef<HTMLDivElement>(null);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  if (!projectData) {
    return <p className="text-gray-500">Projeto não encontrado.</p>;
  }

  const project = {
    ...projectData,
    created_at: new Date(projectData.created_at),
    files: projectData.files.map((file) => ({
      ...file,
      created_at: new Date(file.created_at),
      updated_at: file.updated_at ? new Date(file.updated_at) : null,
    })),
    client: {
      ...projectData.client,
      created_at: new Date(projectData.client.created_at),
      updated_at: projectData.client.updated_at
        ? new Date(projectData.client.updated_at)
        : null,
    },
    project_steps: projectData.project_steps.map((step) => ({
      ...step,
      last_updated_at: step.last_updated_at
        ? new Date(step.last_updated_at)
        : null,
    })),
  };

  const handleStatusChange = async (
    step_id: string,
    status: ProjectStep["status"]
  ) => {
    setUpdatingStepId(step_id);

    try {
      await updateProjectStep(
        project_id,
        step_id,
        { status },
        user.access_token
      );
      await reload();
    } catch (err) {
      showToast("Oops!", "Erro ao atualizar a etapa.", "error");
    } finally {
      setUpdatingStepId(null);
    }
  };

  // Optimistic: show the new order right away, resync if the API fails
  const handleReorder = async (reordered: typeof project.project_steps) => {
    setData((current) => ({
      ...current,
      project: current.project && {
        ...current.project,
        project_steps: reordered.map(
          (step) =>
            current.project!.project_steps.find(
              (original) => original.id === step.id
            )!
        ),
      },
    }));
    setIsReordering(true);

    try {
      await reorderProjectSteps(
        project_id,
        reordered.map((step) => step.step_id),
        user.access_token
      );
    } catch (err) {
      showToast("Oops!", "Erro ao reordenar as etapas.", "error");
      await reload();
    } finally {
      setIsReordering(false);
    }
  };

  const handleAddStep = async () => {
    if (!stepToAdd) return;

    try {
      await addProjectStep(project_id, stepToAdd, user.access_token);
      setStepToAdd(null);
      await reload();
    } catch (err) {
      showToast("Oops!", "Erro ao adicionar a etapa.", "error");
    }
  };

  const handleRemoveStep = async (step_id: string) => {
    try {
      await removeProjectStep(project_id, step_id, user.access_token);
      setStepToRemove(null);
      await reload();
    } catch (err) {
      showToast("Oops!", "Erro ao remover a etapa.", "error");
    }
  };

  const availableStepOptions = officeSteps
    .filter(
      (officeStep) =>
        !project.project_steps.some((step) => step.step_id === officeStep.id)
    )
    .map((step) => ({ value: step.id, label: step.name }));

  const closeUpload = () => {
    setPendingFile(null);
    setDropzoneKey((key) => key + 1);
  };

  const handleFileUploaded = async () => {
    closeUpload();
    showToast("Sucesso!", "Arquivo enviado.", "success");
    await reload();
  };

  const handleRemoveFile = async (project_file_id: string) => {
    try {
      await deleteProjectFile(project_file_id, user.access_token);
      setFileToRemove(null);
      await reload();
    } catch (err) {
      showToast("Oops!", "Erro ao remover o arquivo.", "error");
    }
  };

  const handleResponsibleChange = async (
    step_id: string,
    employee_id: string | null
  ) => {
    setUpdatingStepId(step_id);

    try {
      await updateProjectStep(
        project_id,
        step_id,
        { assigned_to: employee_id },
        user.access_token
      );
      await reload();
    } catch (err) {
      showToast("Oops!", "Erro ao definir o responsável.", "error");
    } finally {
      setUpdatingStepId(null);
    }
  };

  const handleFileEdited = async () => {
    setFileToEdit(null);
    showToast("Sucesso!", "Arquivo atualizado.", "success");
    await reload();
  };

  // "Ver arquivos" on a step: filter the file list by it and scroll there
  const showStepFiles = (project_step_id: string) => {
    setStepFilter(project_step_id);
    filesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    // Sorting by category makes no sense when showing a single one
    if (value && fileSort === "category") setFileSort("recent");
  };

  // Project steps as options, numbered like the list (value = ProjectStep id)
  const projectStepOptions = project.project_steps.map((step, index) => ({
    value: step.id,
    label: `${index + 1}. ${step.step.name}`,
  }));

  const fileCountByStep = project.files.reduce<Record<string, number>>(
    (counts, file) => {
      if (file.project_step_id) {
        counts[file.project_step_id] = (counts[file.project_step_id] ?? 0) + 1;
      }
      return counts;
    },
    {}
  );

  const matchesFilter = (filter: string, value: string | null) =>
    !filter || (filter === "none" ? !value : value === filter);

  const visibleFiles = project.files
    .filter(
      (file) =>
        matchesFilter(categoryFilter, file.category_id) &&
        matchesFilter(stepFilter, file.project_step_id)
    )
    .sort((a, b) => {
      if (fileSort === "category") {
        // Files without a category go last; ties keep newest first
        const byCategory = (a.category?.name ?? "￿").localeCompare(
          b.category?.name ?? "￿",
          "pt-BR"
        );
        if (byCategory !== 0) return byCategory;
      }
      const byDate = b.created_at.getTime() - a.created_at.getTime();
      return fileSort === "oldest" ? -byDate : byDate;
    });

  const isFiltering = !!categoryFilter || !!stepFilter;

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{project?.name}</h1>
          <div className="max-w-md">
            <ProgressBar steps={project.project_steps} />
          </div>
          <div className="flex gap-4 items-center text-blue-500 text-sm">
            <div>
              <p className="flex gap-2  items-center justify-center">
                Cliente:{" "}
                {project?.client ? (
                  <span className="flex gap-2 items-center justify-center">
                    <AvatarCircle
                      name={project?.client.name}
                      image={project.client.logo}
                      size="small"
                    />
                    <p className="text-gray-500">{project.client.name}</p>
                  </span>
                ) : (
                  <span className="text-gray-500">Sem cliente</span>
                )}
              </p>
            </div>

            <p>
              Data de criação:{" "}
              <span className="text-gray-500">
                {project?.created_at
                  ? formatDistance(project?.created_at, Date.now(), {
                      addSuffix: true,
                      locale: ptBR,
                    })
                  : "Sem data"}
              </span>
            </p>

            <p>
              Última atualização:{" "}
              <span className="text-gray-500">
                {project?.updated_at
                  ? formatDistance(project?.updated_at, Date.now(), {
                      addSuffix: true,
                      locale: ptBR,
                    })
                  : "Sem data"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex gap-16 flex-col mt-8">
          <div className="">
            <h2 className="text-xl font-semibold">Etapas</h2>
            <div className="flex flex-col gap-6 mt-4 ml-12 max-w-5xl">
              {project.project_steps.length === 0 ? (
                <p className="text-gray-500">Esse projeto não tem etapas.</p>
              ) : (
                <SortableList
                  items={project.project_steps}
                  onReorder={handleReorder}
                  disabled={isReordering}
                  renderItem={(step) => (
                    <>
                      <ProjectStepInfo step={step} />
                      <ResponsibleSelect
                        responsible={step.assigned}
                        employees={employees}
                        disabled={updatingStepId === step.step_id}
                        onChange={(employee_id) =>
                          handleResponsibleChange(step.step_id, employee_id)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => showStepFiles(step.id)}
                        className="flex gap-1 items-center text-sm text-blue-500 hover:opacity-80 transition-opacity"
                      >
                        <MdFolderOpen size={18} />
                        Ver arquivos ({fileCountByStep[step.id] ?? 0})
                      </button>
                      <StepStatusSelect
                        value={step.status}
                        disabled={updatingStepId === step.step_id}
                        onChange={(status) =>
                          handleStatusChange(step.step_id, status)
                        }
                      />
                      <Modal
                        open={stepToRemove === step.step_id}
                        onOpenChange={(open) =>
                          setStepToRemove(open ? step.step_id : null)
                        }
                        trigger={
                          <span
                            aria-label={`Remover etapa ${step.step.name}`}
                            className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <MdDelete size={20} />
                          </span>
                        }
                        title={
                          <strong className="text-2xl font-title">
                            Remover a etapa {step.step.name}?
                          </strong>
                        }
                        description="A etapa sai deste projeto, junto com o status e o responsável dela. Os arquivos ligados a ela continuam no projeto, sem etapa."
                        content={
                          <ConfirmRemoval
                            message="Você pode adicionar a etapa de novo depois, mas ela volta como não iniciada e no fim da lista."
                            onConfirm={() => handleRemoveStep(step.step_id)}
                            onCancel={() => setStepToRemove(null)}
                          />
                        }
                      />
                    </>
                  )}
                />
              )}

              <div className="flex gap-4 items-end">
                <div className="w-72">
                  <SelectInput
                    label="Adicionar etapa"
                    onChange={(option) => setStepToAdd(option?.value ?? null)}
                    value={
                      availableStepOptions.find(
                        (option) => option.value === stepToAdd
                      ) ?? null
                    }
                    options={availableStepOptions}
                  />
                </div>
                <Button
                  text="ADICIONAR"
                  size="small"
                  disabled={!stepToAdd}
                  onClick={handleAddStep}
                />
              </div>
              {officeSteps.length === 0 && (
                <p className="text-sm text-gray-500">
                  Cadastre etapas em Configurações › Etapas de projetos para
                  usá-las aqui.
                </p>
              )}
            </div>
          </div>

          <div ref={filesSectionRef} className="scroll-mt-8">
            <h2 className="text-xl font-semibold">Arquivos</h2>
            {project.files.length > 0 && (
              <div className="flex gap-4 items-end flex-wrap mt-4">
                <FilterSelect
                  label="Categoria"
                  value={categoryFilter}
                  onChange={handleCategoryFilterChange}
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
                  onChange={setStepFilter}
                  options={[
                    { value: "", label: "Todas as etapas" },
                    ...projectStepOptions,
                    { value: "none", label: "Sem etapa" },
                  ]}
                />
                <FilterSelect
                  label="Ordenar por"
                  value={fileSort}
                  onChange={(value) => setFileSort(value as typeof fileSort)}
                  options={[
                    { value: "recent", label: "Mais recentes" },
                    { value: "oldest", label: "Mais antigos" },
                    // Only useful while showing more than one category
                    ...(categoryFilter
                      ? []
                      : [{ value: "category", label: "Categoria (A-Z)" }]),
                  ]}
                />
                {isFiltering && (
                  <div className="flex gap-3 items-center pb-2">
                    <p className="text-sm text-gray-500">
                      {visibleFiles.length} de {project.files.length} arquivos
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFilter("");
                        setStepFilter("");
                      }}
                      className="text-sm text-blue-500 hover:opacity-80"
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}
              </div>
            )}
            {pendingFile && (
              <div className="mt-4 max-w-3xl">
                <UploadProjectFileForm
                  file={pendingFile}
                  project_id={project_id}
                  categories={categories}
                  stepOptions={projectStepOptions}
                  defaultProjectStepId={
                    stepFilter && stepFilter !== "none" ? stepFilter : null
                  }
                  onUploaded={handleFileUploaded}
                  onCancel={closeUpload}
                  onError={(message) => showToast("Oops!", message, "error")}
                />
              </div>
            )}
            <div className="my-8 grid grid-cols-4 gap-4">
              <div className="">
                <Dropzone
                  key={dropzoneKey}
                  description="Enviar arquivo (PDF, DWG, SKP, imagens ou qualquer outro)"
                  setFile={setPendingFile}
                  height="56"
                  allowAnyFile
                />
              </div>
              {visibleFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col justify-between min-h-[14rem] gap-3 p-4 ring-2 ring-gray-300 rounded-md hover:shadow-lg hover:ring-blue-300 transition"
                >
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      className="mb-2 text-lg font-semibold break-all"
                      title={file.name}
                    >
                      {shortenString(file.name)}
                    </h3>
                    <div className="flex gap-2 items-center shrink-0">
                      <Modal
                        open={fileToEdit === file.id}
                        onOpenChange={(open) =>
                          setFileToEdit(open ? file.id : null)
                        }
                        trigger={
                          <span
                            aria-label={`Editar arquivo ${file.name}`}
                            className="flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                          >
                            <MdEdit size={20} />
                          </span>
                        }
                        title={
                          <strong className="text-2xl font-title">
                            Editar {shortenString(file.name)}
                          </strong>
                        }
                        description="Altere a categoria e a etapa do arquivo."
                        content={
                          <EditProjectFileForm
                            file={file}
                            categories={categories}
                            stepOptions={projectStepOptions}
                            onSaved={handleFileEdited}
                            onError={(message) =>
                              showToast("Oops!", message, "error")
                            }
                          />
                        }
                      />
                      {file.path && (
                        <a
                          href={file.path}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Baixar ${file.name}`}
                        >
                          <MdDownload className="text-2xl text-blue-500 hover:opacity-80" />
                        </a>
                      )}
                      <Modal
                        open={fileToRemove === file.id}
                        onOpenChange={(open) =>
                          setFileToRemove(open ? file.id : null)
                        }
                        trigger={
                          <span
                            aria-label={`Remover arquivo ${file.name}`}
                            className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <MdDelete size={22} />
                          </span>
                        }
                        title={
                          <strong className="text-2xl font-title">
                            Remover {file.name}?
                          </strong>
                        }
                        description="O arquivo é apagado do armazenamento e sai do projeto."
                        content={
                          <ConfirmRemoval
                            message="Essa ação não pode ser desfeita."
                            onConfirm={() => handleRemoveFile(file.id)}
                            onCancel={() => setFileToRemove(null)}
                          />
                        }
                      />
                    </div>
                  </div>

                  <span className="flex gap-2">
                    Categoria:
                    <p className="font-semibold">
                      {file.category?.name ?? "Sem categoria"}
                    </p>
                  </span>
                  <span className="flex gap-2">
                    Etapa:
                    <p className="font-semibold">
                      {projectStepOptions.find(
                        (option) => option.value === file.project_step_id
                      )?.label ?? "Sem etapa"}
                    </p>
                  </span>
                  <div className="flex flex-col gap-1 mt-2 items-start">
                    <span className="flex gap-1 items-center justify-start text-blue-500 text-sm">
                      <AvatarCircle
                        name={file.created_by.name}
                        image={file.created_by.avatar}
                        size="small"
                      />
                      <p className="text-gray-700 text-base">
                        {file.created_by.name}
                      </p>
                    </span>
                    <p className="text-sm text-gray-500">
                      criou{" "}
                      {formatDistance(file.created_at, Date.now(), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {isFiltering && visibleFiles.length === 0 && (
              <p className="text-gray-500 -mt-4">
                Nenhum arquivo com esses filtros.
              </p>
            )}
          </div>
        </div>

        <CornerToast
          type={toastType}
          open={toastOpen}
          setOpen={setToastOpen}
          title={toastTitle}
          text={toastText}
        />
      </div>
    </Toast.Provider>
  );
};

export default ProjectDetailsPage;

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
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdDelete, MdFolderOpen } from "react-icons/md";
import ResponsibleSelect from "@/app/components/Project/ResponsibleSelect";
import FileExplorer from "@/app/components/Project/Files/FileExplorer";
import { listEmployees } from "@/app/lib/api/office-api/employees/list-employees";
import { Employee } from "@/app/lib/api/employees/dtos";
import { listProjectFolders } from "@/app/lib/api/office-api/project-folders/list-project-folders";
import { ProjectFolder } from "@/app/lib/api/office-api/project-folders/dtos";

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
  // Folder tree of the project's files, as a flat list
  folders: ProjectFolder[];
}

const ProjectDetailsPage = ({
  params: { project_id },
}: ProjectDetailsPageProps) => {
  const fetchProjectDetails = useCallback(
    async (access_token: string): Promise<ProjectDetailsData> => {
      const [project, officeSteps, categories, employees, folders] =
        await Promise.all([
          findProject(access_token, project_id),
          listSteps(access_token),
          listCategories(access_token),
          listEmployees(access_token),
          listProjectFolders(access_token, project_id),
        ]);

      return { project, officeSteps, categories, employees, folders };
    },
    [project_id]
  );

  const {
    user,
    data: { project: projectData, officeSteps, categories, employees, folders },
    setData,
    reload,
    isLoading,
  } = useOfficeData<ProjectDetailsData>(fetchProjectDetails, {
    project: null,
    officeSteps: [],
    categories: [],
    employees: [],
    folders: [],
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
  // Step filter of the file explorer: "" = all, "none" = no step, or an id
  const [stepFilter, setStepFilter] = useState("");
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

  // "Ver arquivos" on a step: filter the file list by it and scroll there
  const showStepFiles = (project_step_id: string) => {
    setStepFilter(project_step_id);
    filesSectionRef.current?.scrollIntoView({ behavior: "smooth" });
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

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div>
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold break-words">{project?.name}</h1>
          <div className="max-w-md">
            <ProgressBar steps={project.project_steps} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 items-center text-blue-500 text-sm">
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

        <div className="flex gap-12 md:gap-16 flex-col mt-8">
          <div className="">
            <h2 className="text-xl font-semibold">Etapas</h2>
            <div className="flex flex-col gap-6 mt-4 md:ml-12 max-w-5xl">
              {project.project_steps.length === 0 ? (
                <p className="text-gray-500">Esse projeto não tem etapas.</p>
              ) : (
                <SortableList
                  items={project.project_steps}
                  onReorder={handleReorder}
                  disabled={isReordering}
                  renderItem={(step) => (
                    // Phones: step name on its own line, controls wrap below
                    <div className="flex flex-1 min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                      <div className="basis-full md:basis-auto min-w-0">
                        <ProjectStepInfo step={step} />
                      </div>
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
                        className="flex gap-1 items-center min-h-[44px] md:min-h-0 text-sm text-blue-500 hover:opacity-80 transition-opacity"
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
                            className="flex items-center p-2 -m-2 text-gray-400 hover:text-red-400 transition-colors"
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
                    </div>
                  )}
                />
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
                <div className="w-full sm:w-72">
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
            <FileExplorer
              project_id={project_id}
              files={project.files}
              folders={folders}
              categories={categories}
              stepOptions={projectStepOptions}
              stepFilter={stepFilter}
              onStepFilterChange={setStepFilter}
              onChanged={reload}
              showToast={showToast}
            />
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

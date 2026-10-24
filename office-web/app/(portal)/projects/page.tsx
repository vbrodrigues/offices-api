"use client";

import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdClose, MdCreateNewFolder, MdTopic } from "react-icons/md";
import { Modal } from "@/app/components/Modal";
import { DataList } from "@/app/components/DataList";
import { ActionLabel, PageHeader } from "@/app/components/PageHeader";
import { listProjects } from "@/app/lib/api/office-api/projects/list-projects";
import CreateProjectForm from "@/app/components/Form/CreateProjectForm";
import AvatarCircle from "@/app/components/AvatarCircle";
import Link from "next/link";
import { Project } from "@/app/lib/api/office-api/projects/dtos";
import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import LoadingPage from "@/app/(portal)/loading";
import useOfficeData from "@/app/hooks/useOfficeData";
import { listSteps } from "@/app/lib/api/office-api/steps/list-steps";
import { listClients } from "@/app/lib/api/office-api/clients/list-clients";
import { Step } from "@/app/lib/api/office-api/steps/dtos";
import { Client } from "@/app/lib/api/office-api/clients/dtos";
import ProgressBar from "@/app/components/ProgressBar";
import * as Toast from "@radix-ui/react-toast";
import { useCallback } from "react";
import { useSearchParams } from "next/navigation";

interface ProjectsPageData {
  projects: Project[];
  steps: Step[];
  clients: Client[];
}

const ProjectsPage = () => {
  // Set by "Ver projetos" on a client card
  const client_id = useSearchParams()?.get("client_id") ?? undefined;

  const fetchProjectsPageData = useCallback(
    async (access_token: string): Promise<ProjectsPageData> => {
      const [projects, steps, clients] = await Promise.all([
        listProjects(access_token, { client_id }),
        listSteps(access_token),
        listClients(access_token),
      ]);

      return { projects, steps, clients };
    },
    [client_id]
  );

  const {
    user,
    data: { projects: projectsData, steps, clients },
    reload,
    isLoading,
  } = useOfficeData(fetchProjectsPageData, {
    projects: [],
    steps: [],
    clients: [],
  });

  const filteredClient = clients.find((client) => client.id === client_id);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <UnauthorizedPage />;
  }

  const projects = projectsData.map((project: Project) => ({
    ...project,
    created_at: new Date(project.created_at),
    files: project.files.map((file) => ({
      ...file,
      created_at: new Date(file.created_at),
      updated_at: file.updated_at ? new Date(file.updated_at) : null,
    })),
    client: {
      ...project.client,
      created_at: new Date(project.client.created_at),
      updated_at: project.client.updated_at
        ? new Date(project.client.updated_at)
        : null,
    },
    project_steps: project.project_steps.map((step) => ({
      ...step,
      last_updated_at: step.last_updated_at
        ? new Date(step.last_updated_at)
        : null,
    })),
  }));

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="w-full max-w-[90rem]">
        <PageHeader
          title="Projetos"
          action={
            <Modal
              trigger={
                <ActionLabel
                  icon={<MdCreateNewFolder size={24} color="#f3f4f6" />}
                  label="Criar novo projeto"
                />
              }
              title={
                <div className="flex gap-4 items-center">
                  <MdCreateNewFolder size={40} color="#3b82f6" />
                  <strong className="text-2xl font-title">
                    Adicionar projeto
                  </strong>
                </div>
              }
              description="Preencha as informações do seu novo projeto!"
              content={
                <CreateProjectForm
                  steps={steps}
                  clients={clients}
                  onCreated={reload}
                />
              }
            />
          }
        >
          {client_id ? (
            <div className="flex flex-wrap gap-3 items-center">
              <p className="text-gray-700 text-lg">
                <strong>{projects.length}</strong> projetos de{" "}
                <strong>{filteredClient?.name ?? "um cliente removido"}</strong>
                .
              </p>
              <Link
                href="/projects"
                className="flex gap-2 items-center border border-blue-500 bg-blue-100 rounded-full px-4 py-2 text-blue-900 hover:opacity-80 transition-opacity"
              >
                <MdClose size={16} />
                Ver todos
              </Link>
            </div>
          ) : (
            <p className="text-gray-700 text-lg">
              Sua empresa possui <strong>{projects.length}</strong> projetos.
            </p>
          )}
        </PageHeader>

        <DataList
          items={projects}
          getKey={(project) => project.id}
          columns={[
            {
              header: "CLIENTE",
              cell: (project) => (
                <span className="flex items-center gap-4">
                  <AvatarCircle
                    image={project.client.logo}
                    name={project.client.name}
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <strong>{project.client.name}</strong>
                    <p className="text-sm text-gray-500 break-all">
                      {project.client.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {project.client.phone_number}
                    </p>
                  </div>
                </span>
              ),
            },
            {
              header: "PROJETO",
              cell: (project) => (
                <div>
                  <strong>{project.name}</strong>
                  <p className="text-sm text-gray-500">
                    Projeto iniciado{" "}
                    {formatDistance(project.created_at, Date.now(), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              ),
            },
            {
              header: "PROGRESSO",
              cell: (project) => <ProgressBar steps={project.project_steps} />,
            },
            {
              header: "DETALHES",
              cell: (project) => (
                <Link
                  href={`/projects/${project.id}`}
                  className="flex gap-2 items-center text-gray-500 hover:text-blue-500 transition-colors min-h-[44px]"
                >
                  <MdTopic size={24} />
                  <p>Abrir projeto</p>
                </Link>
              ),
            },
          ]}
          // On phones the whole card opens the project
          renderCard={(project) => (
            <Link
              href={`/projects/${project.id}`}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <AvatarCircle
                  image={project.client.logo}
                  name={project.client.name}
                  size="small"
                />
                <div className="min-w-0">
                  <strong className="block truncate">{project.name}</strong>
                  <p className="text-sm text-gray-500 truncate">
                    {project.client.name} · iniciado{" "}
                    {formatDistance(project.created_at, Date.now(), {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </div>
              </div>
              <ProgressBar steps={project.project_steps} />
            </Link>
          )}
          empty={
            <p className="text-gray-500 mt-6">
              Nenhum projeto ainda. Crie o primeiro pelo botão +.
            </p>
          }
        />
      </div>
    </Toast.Provider>
  );
};

export default ProjectsPage;

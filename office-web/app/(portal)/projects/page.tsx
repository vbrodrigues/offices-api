"use client";

import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdClose, MdCreateNewFolder, MdTopic } from "react-icons/md";
import { Modal } from "@/app/components/Modal";
import { Table } from "@/app/components/Table/Table";
import { TableRow } from "@/app/components/Table/TableRow";
import { TableCell } from "@/app/components/Table/TableCell";
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
      <div className="p-10 w-full max-w-[90rem] min-w-[50rem]">
        <div className="flex justify-between items-center">
          <h1 className="font-title text-2xl">Projetos</h1>

          <Modal
            trigger={
              <span className="bg-blue-500 py-3 px-6 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2">
                <MdCreateNewFolder size={20} color="#f3f4f6" />
                Criar novo projeto
              </span>
            }
            title={
              <div className="flex gap-6 items-center">
                <MdCreateNewFolder size={48} color="#3b82f6" />
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
        </div>

        {client_id ? (
          <div className="mt-4 flex gap-4 items-center">
            <p className="text-gray-700 text-lg">
              <strong>{projects.length}</strong> projetos de{" "}
              <strong>{filteredClient?.name ?? "um cliente removido"}</strong>.
            </p>
            <Link
              href="/projects"
              className="flex gap-2 items-center border border-blue-500 bg-blue-100 rounded-full px-4 py-1 text-blue-900 hover:opacity-80 transition-opacity"
            >
              <MdClose size={16} />
              Ver todos
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-gray-700 text-lg">
            Sua empresa possui <strong>{projects.length}</strong> projetos.
          </p>
        )}

        <Table columnNames={["CLIENTE", "PROJETO", "PROGRESSO", "DETALHES"]}>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>
                <span className="flex items-center gap-4">
                  <AvatarCircle
                    image={project.client.logo}
                    name={project.client.name}
                  />
                  <div className="flex flex-col gap-2">
                    <strong>{project.client.name}</strong>
                    <div className="flex flex-col">
                      <p>{project.client.email}</p>
                      <p>{project.client.phone_number}</p>
                    </div>
                  </div>
                </span>
              </TableCell>

              <TableCell>
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
              </TableCell>

              <TableCell>
                <ProgressBar steps={project.project_steps} />
              </TableCell>

              <TableCell>
                <Link
                  href={`/projects/${project.id}`}
                  className="flex gap-2 justify-center items-center text-gray-500 hover:cursor-pointer hover:text-blue-500 transition-colors"
                >
                  <MdTopic size={24} />
                  <p>Abrir projeto</p>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </div>
    </Toast.Provider>
  );
};

export default ProjectsPage;

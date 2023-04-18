"use client";

import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdCreateNewFolder, MdTopic } from "react-icons/md";
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
import useUser from "@/app/hooks/useUser";

const ProjectsPage = async () => {
  const { getCurrentUser } = useUser();

  const user = await getCurrentUser();

  if (!user) {
    return <UnauthorizedPage />;
  }

  const projectsData = await listProjects(user.access_token);

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
  }));

  return (
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
              <strong className="text-2xl font-title">Adicionar projeto</strong>
            </div>
          }
          description="Preencha as informações do seu novo projeto!"
          content={<CreateProjectForm />}
        />
      </div>

      <p className="mt-4 text-gray-700 text-lg">
        Sua empresa possui <strong>{projects.length}</strong> projetos.
      </p>

      <Table columnNames={["CLIENTE", "PROJETO", "DETALHES"]}>
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
  );
};

export default ProjectsPage;

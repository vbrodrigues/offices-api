"use client";

import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Folders, Plus } from "phosphor-react";
import * as Avatar from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar/Sidebar";
import { Modal } from "@/components/Modal";
import { Table } from "@/components/Table/Table";
import { TableRow } from "@/components/Table/TableRow";
import { TableCell } from "@/components/Table/TableCell";
import { Project, listProjects } from "@/lib/api/office-api/list-projects";
import CreateProjectForm from "@/components/Form/CreateProjectForm";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const access_token = localStorage.getItem("access_token");

      if (access_token) {
        const projectsData = await listProjects(access_token);

        const projectsList = projectsData.map((project: Project) => ({
          ...project,
          created_at: new Date(project.created_at),
          files: project.files.map((file) => ({
            ...file,
            created_at: new Date(file.created_at),
            updated_at: file.updated_at ? new Date(file.updated_at) : undefined,
          })),
          client: {
            ...project.client,
            created_at: new Date(project.client.created_at),
            updated_at: new Date(project.client.updated_at),
            initials:
              project.client.name.split(" ").length > 1
                ? `${project.client.name.split(" ")[0][0]}${
                    project.client.name.split(" ")[1][0]
                  }`
                : project.client.name.split(" ")[0][0],
          },
        }));
        setProjects(projectsList);
      }
    }

    fetchProjects();
  }, [setProjects]);

  return (
    <div className="flex flex-col h-[100vh] w-[100vw]">
      <Header />

      <main className="flex m-10 justify-center">
        <Sidebar />

        <div className="p-10 w-full max-w-[90rem] min-w-[50rem]">
          <div className="flex justify-between items-center">
            <h1 className="font-title text-2xl">Projetos</h1>

            <Modal
              trigger={
                <span className="bg-blue-500 py-3 px-6 rounded-lg text-gray-100 font-title tracking-wide hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Plus size={20} color="#f3f4f6" />
                  Adicionar projeto
                </span>
              }
              title={
                <div className="flex gap-6 items-center">
                  <Folders size={48} color="#3b82f6" />
                  <strong className="text-2xl font-title">
                    Adicionar projeto
                  </strong>
                </div>
              }
              description="Preencha as informações do seu novo projeto!"
              content={<CreateProjectForm />}
            />
          </div>

          <p className="mt-4 text-gray-700 text-lg">
            Sua empresa possui <strong>{projects.length}</strong> projetos.
          </p>

          <Table columnNames={["CLIENTE", "CONTATO", ""]}>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <span className="flex items-center gap-4">
                    <Avatar.Root>
                      <Avatar.Image
                        src={project.client.avatar}
                        alt=""
                        className="w-14 rounded-full border border-blue-300"
                      />
                      <Avatar.Fallback className="w-14 h-14 rounded-full bg-blue-100 border border-blue-300 p-4 font-bold flex items-center justify-center text-center">
                        {project.client.initials}
                      </Avatar.Fallback>
                    </Avatar.Root>
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
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;

"use client";

import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import AvatarCircle from "@/app/components/AvatarCircle";
import useUser from "@/app/hooks/useUser";
import { findProject } from "@/app/lib/api/office-api/projects/find-project";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdDownload } from "react-icons/md";

interface ProjectDetailsPageProps {
  params: {
    project_id: string;
  };
}

const ProjectDetailsPage = async ({
  params: { project_id },
}: ProjectDetailsPageProps) => {
  const { getCurrentUser } = useUser();

  const user = await getCurrentUser();

  if (!user) {
    return <UnauthorizedPage />;
  }

  const projectData = await findProject(user.access_token, project_id);
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
  };

  console.log(project);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">{project?.name}</h1>
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

      <div className="flex gap-8 flex-col mt-8">
        <div className="bg-red-200">
          <h2 className="text-xl font-semibold">Etapas</h2>
          <div></div>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold">Arquivos</h2>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {project.files?.map((file) => (
              <a
                href={file.path}
                key={file.id}
                className="p-4 ring-2 ring-gray-300 rounded-md hover:cursor-pointer hover:shadow-lg hover:ring-blue-300 transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="mb-2 text-lg font-semibold">{file.name}</h3>
                  <MdDownload className="text-2xl text-blue-500" />
                </div>

                <span className="">
                  Categoria:
                  <p>{file.category_id}</p>
                </span>

                <p className="text-sm mt-2">
                  Criado{" "}
                  {formatDistance(file.created_at, Date.now(), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;

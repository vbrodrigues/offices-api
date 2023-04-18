import AvatarCircle from "@/app/components/AvatarCircle";
import { findProject } from "@/app/lib/api/office-api/projects/find-project";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { cookies } from "next/headers";

interface ProjectDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectDetailsPage({
  params: { id },
}: ProjectDetailsPageProps) {
  const access_token = cookies().get("access_token")?.value;

  let project = null;
  if (access_token) {
    const projectData = await findProject(access_token, id);
    project = {
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
  }

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

      <div></div>
    </div>
  );
}

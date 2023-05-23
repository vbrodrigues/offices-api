"use client";

import UnauthorizedPage from "@/app/(errors)/unauthorized/page";
import AvatarCircle from "@/app/components/AvatarCircle";
import useUser from "@/app/hooks/useUser";
import { findProject } from "@/app/lib/api/office-api/projects/find-project";
import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { MdDownload } from "react-icons/md";
import { AiFillCheckCircle } from "react-icons/ai";
import { convertBase64, shortenString } from "@/app/lib/utils";
import { Dropzone } from "@/app/components/Form/Dropzone";

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
    project_steps: projectData.project_steps.map((step) => ({
      ...step,
      last_updated_at: step.last_updated_at
        ? new Date(step.last_updated_at)
        : null,
    })),
  };

  console.log(project);

  const handleDropzoneChange = async (file: File) => {
    const encodedFile = (await convertBase64(file)) as string;
  };

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

      <div className="flex gap-16 flex-col mt-8">
        <div className="">
          <h2 className="text-xl font-semibold">Etapas</h2>
          <div className="flex flex-col gap-4 mt-4 ml-12">
            {project.project_steps?.map((step) => (
              <span key={step.id} className="flex gap-2 items-center">
                {step.status === "completed" ? (
                  <>
                    <AiFillCheckCircle className="text-green-500 text-lg" />
                    <p className="text-green-600">{step.step.name}</p>
                    <div>
                      {step.assigned && (
                        <div className="flex gap-2 items-center justify-center text-blue-500 text-sm">
                          {" - "}
                          <AvatarCircle
                            name={step.assigned.name}
                            image={step.assigned.avatar}
                            size="small"
                          />
                          <p className="text-gray-700 text-base">
                            {step.assigned?.name}
                          </p>
                          <p className="text-gray-400 text-base">
                            concluiu{" "}
                            {step?.last_updated_at
                              ? formatDistance(
                                  step.last_updated_at,
                                  Date.now(),
                                  {
                                    addSuffix: true,
                                    locale: ptBR,
                                  }
                                )
                              : "Sem data"}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : step.status === "in-progress" ? (
                  <>
                    <div className="bg-blue-200 h-4 w-4 rounded-full flex items-center justify-center">
                      <div className="bg-blue-700 rounded-full h-2 w-2"></div>
                    </div>
                    <p className="text-blue-700">{step.step.name}</p>
                    <div>
                      {step.assigned && (
                        <div className="flex gap-2 items-center justify-center text-blue-500 text-sm">
                          {" - "}
                          <AvatarCircle
                            name={step.assigned.name}
                            image={step.assigned.avatar}
                            size="small"
                          />
                          <p className="text-gray-700 text-base">
                            {step.assigned?.name}
                          </p>
                          <p className="text-gray-400 text-base">
                            atualizou por último{" "}
                            {step?.last_updated_at
                              ? formatDistance(
                                  step.last_updated_at,
                                  Date.now(),
                                  {
                                    addSuffix: true,
                                    locale: ptBR,
                                  }
                                )
                              : "Sem data"}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : step.status === "not-started" ? (
                  <>
                    <div className="bg-gray-200 h-4 w-4 rounded-full flex items-center justify-center">
                      <div className="bg-gray-500 rounded-full h-2 w-2"></div>
                    </div>
                    <p className="text-gray-500">{step.step.name}</p>
                    <div>
                      {step.assigned && (
                        <div className="flex gap-2 items-center justify-center text-blue-500 text-sm">
                          {" - "}
                          <AvatarCircle
                            name={step.assigned.name}
                            image={step.assigned.avatar}
                            size="small"
                          />
                          <p className="text-gray-700 text-base">
                            {step.assigned?.name}
                          </p>
                          <p className="text-gray-400 text-base">
                            ainda não iniciou esta etapa
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-200 h-4 w-4 flex items-center justify-center">
                      <div className="bg-red-300 h-2 w-2"></div>
                    </div>
                    <p className="text-gray-500">{step.step.name}</p>
                    <div>
                      {step.assigned && (
                        <div className="flex gap-2 items-center justify-center text-blue-500 text-sm">
                          {" - "}
                          <AvatarCircle
                            name={step.assigned.name}
                            image={step.assigned.avatar}
                            size="small"
                          />
                          <p className="text-gray-700 text-base">
                            {step.assigned?.name}
                          </p>
                          <p className="text-gray-400 text-base">
                            paralizou esta etapa
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="">
          <h2 className="text-xl font-semibold">Arquivos</h2>
          <div className="my-8 grid grid-cols-4 gap-4">
            <div className="">
              <Dropzone
                description="Criar arquivo"
                setFile={handleDropzoneChange}
                height="56"
              />
            </div>
            {project.files?.map((file) => (
              <a
                href={file.path}
                key={file.id}
                className="flex flex-col justify-between max-h-56 h-56 gap-4 p-4 ring-2 ring-gray-300 rounded-md hover:cursor-pointer hover:shadow-lg hover:ring-blue-300 transition"
              >
                <div className="flex justify-between items-center">
                  <h3 className="mb-2 text-lg font-semibold">
                    {shortenString(file.name)}
                  </h3>
                  <MdDownload className="text-2xl text-blue-500" />
                </div>

                <span className="flex gap-2">
                  Categoria:
                  <p className="font-semibold">{file.category.name}</p>
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPage;

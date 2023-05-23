import { useParams } from "next/navigation";
import { useMemo } from "react";

const useProject = () => {
  const params = useParams();

  const project_id = useMemo(() => {
    if (!params?.project_id) {
      return "";
    }

    return params.project_id as string;
  }, [params?.project_id]);

  return useMemo(() => {
    return {
      project_id,
    };
  }, [project_id]);
};

export default useProject;

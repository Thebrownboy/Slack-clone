import { useParams } from "next/navigation";

function useGetWorkspaceId() {
  const { workspaceId } = useParams();
  return { workspaceId };
}

export default useGetWorkspaceId;

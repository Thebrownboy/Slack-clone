import { useParams } from "next/navigation";

export default function WorkspaceSidebar() {
  const { workspaceId } = useParams();
  console.log(workspaceId);
  return <div>WorkspaceSidebar</div>;
}

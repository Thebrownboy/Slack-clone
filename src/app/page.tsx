import { auth } from "@/auth";
import UserButton from "@/features/auth/components/userButton";

import WorkSpaceModal from "@/features/workspaces/components/workSpaceModal";
export default async function Home() {
  const session = await auth();
  return (
    <div>
      {JSON.stringify(session)}
      <WorkSpaceModal />
      <UserButton />
    </div>
  );
}

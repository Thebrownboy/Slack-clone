"use client";
import { useSession } from "next-auth/react";
import UserButton from "@/features/auth/components/userButton";

import WorkSpaceModal from "@/features/workspaces/components/workSpaceModal";
export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <div>
      {JSON.stringify(session)}
      <WorkSpaceModal />
      <UserButton />
    </div>
  );
}

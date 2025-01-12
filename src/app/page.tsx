"use client";
import { useSession } from "next-auth/react";
import UserButton from "@/features/auth/components/userButton";

import WorkSpaceModal from "@/features/workspaces/components/workSpaceModal";
import Link from "next/link";
export default function Home() {
  const session = useSession();
  return (
    <div>
      {JSON.stringify(session)}
      <WorkSpaceModal />
      <UserButton />
      <Link href={"/workspace/cm5pg7nn40001us0869v9zlqv"}>workspaces</Link>
    </div>
  );
}

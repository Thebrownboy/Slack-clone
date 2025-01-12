"use client";
import { Toolbar } from "../_components/toolbar";
import SideBar from "../_components/SideBar";
import { Loader2Icon } from "lucide-react";

import useWorkspaceGaurd from "@/hooks/useWorkspaceGaurd";

function WorkspaceIdLayout({ children }: { children: React.ReactNode }) {
  // using this techinque here will not affect the performance cuz children can be server components as they wanna
  const { loading } = useWorkspaceGaurd();
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center ">
        <Loader2Icon className="animate-spin" size={60}></Loader2Icon>
      </div>
    );
  }

  return (
    <div className=" h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <SideBar />
        {children}
      </div>
    </div>
  );
}

export default WorkspaceIdLayout;

import React from "react";
import { Toolbar } from "../_components/toolbar";
import SideBar from "../_components/SideBar";

function WorkspaceIdLayout({ children }: { children: React.ReactNode }) {
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

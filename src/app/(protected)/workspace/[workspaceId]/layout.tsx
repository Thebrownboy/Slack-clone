import React from "react";
import { Toolbar } from "../_components/toolbar";

function WorkspaceIdLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className=" h-full">
      <Toolbar />
      {children}
    </div>
  );
}

export default WorkspaceIdLayout;

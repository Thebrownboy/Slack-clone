import { create } from "zustand";

import { tWorkspace } from "@/types/common-types";
type tWorkspaceStore = {
  workSpaces: tWorkspace[];
  updateWorkSpaces: (workSpaces: tWorkspace[]) => void;
};

export const useWorkSpaceStore = create<tWorkspaceStore>((set) => {
  return {
    workSpaces: [],
    updateWorkSpaces(workSpaces: tWorkspace[]) {
      set({ workSpaces });
    },
  };
});

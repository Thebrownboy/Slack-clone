import { create } from "zustand";

type tWorkspace = {
  joinCode: string;
  name: string;
  userId: string;
  id: string;
  createdAt: Date;
};

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

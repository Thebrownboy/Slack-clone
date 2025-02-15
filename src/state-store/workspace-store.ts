import { tWorkspace } from "@/types/common-types";
import { create } from "zustand";

interface iCreateWorkspaceModal {
  isOpen: boolean;
  setOpen(open: boolean): void;
}

export const useCreateWorkspaceModal = create<iCreateWorkspaceModal>((set) => {
  return {
    isOpen: false,
    setOpen(open: boolean) {
      set({ isOpen: open });
    },
  };
});

interface iWorkspaceState {
  isLoading: boolean;
  workSpace: tWorkspace | null;
}
interface iCurrentWorkspace {
  currentWorkspaceState: iWorkspaceState;
  updateWorkspaceState(workspaceState: iWorkspaceState): void;
}

export const useCurrentWorkspace = create<iCurrentWorkspace>((set) => {
  return {
    currentWorkspaceState: {
      isLoading: true,
      workSpace: null,
    },
    updateWorkspaceState(workspaceState: iWorkspaceState) {
      set((state) => ({
        currentWorkspaceState: {
          ...state.currentWorkspaceState,
          ...workspaceState,
        },
      }));
    },
  };
});

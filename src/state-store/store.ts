import { tWorkspace } from "@/types/common-types";
import { create } from "zustand";

interface iCreateWorkspaceModal {
  isOpen: boolean;
  setOpen(open: boolean): void;
}

interface iCurrentWorkspace {
  isLoading: boolean;
  updateLoading(loading: boolean): void;
  workSpace: tWorkspace | null;
  updateWorkspace(workspace: tWorkspace | null): void;
}

export const useWorkSpaceStore = create<iCreateWorkspaceModal>((set) => {
  return {
    isOpen: false,
    setOpen(open: boolean) {
      set({ isOpen: open });
    },
  };
});

export const useCurrentWorkspace = create<iCurrentWorkspace>((set) => {
  return {
    isLoading: true,
    updateLoading(loading: boolean) {
      set((state) => ({ ...state, isLoading: loading }));
    },
    workSpace: null,
    updateWorkspace(workspace: tWorkspace | null) {
      set((state) => ({ ...state, workSpace: workspace }));
    },
  };
});

import { tWorkspace } from "@/types/common-types";
import { create } from "zustand";

interface iUser {
  email: string;
  id: string;
  image: string | null;
  name: string | null;
}

interface IUserStore {
  user: iUser | null;
  updateUser(user: iUser | null): void;
  loading: boolean;
  updateLoading(loading: boolean): void;
}
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

export const useCreateWorkspaceModal = create<iCreateWorkspaceModal>((set) => {
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

export const useCurrentUser = create<IUserStore>((set) => {
  return {
    user: null,
    loading: true,
    updateLoading(loading: boolean) {
      set((state) => ({ ...state, loading }));
    },
    updateUser(user: iUser | null) {
      set((state) => ({ ...state, user }));
    },
  };
});

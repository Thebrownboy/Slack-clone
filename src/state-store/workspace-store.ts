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
  resetData(): void;
}

export const useCurrentWorkspace = create<iCurrentWorkspace>((set) => {
  return {
    resetData() {
      set((state) => {
        return {
          ...state,
          currentWorkspaceState: {
            isLoading: true,
            workSpace: null,
          },
        };
      });
    },
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

interface ICurrentUserWorkspaces {
  userWorkspacesState: {
    userWorkSpaces: tWorkspace[] | null;
    fetching: boolean;
  };
  resetUserWorkspacesData(): void;
  updateCurrentUserWorkspaces(workSpaces: tWorkspace[]): void;
}

export const useCurrentUserWorkspaces = create<ICurrentUserWorkspaces>(
  (set) => {
    return {
      resetUserWorkspacesData() {
        set(() => {
          return {
            userWorkspacesState: {
              fetching: true,
              userWorkSpaces: null,
            },
          };
        });
      },
      userWorkspacesState: {
        fetching: true,
        userWorkSpaces: null,
      },
      updateCurrentUserWorkspaces(workSpaces) {
        set(() => {
          return {
            userWorkspacesState: {
              userWorkSpaces: workSpaces,
              fetching: false,
            },
          };
        });
      },
    };
  }
);

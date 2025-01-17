import { tWorkspace } from "@/types/common-types";
import { create } from "zustand";

interface iUser {
  email: string;
  id: string;
  image: string | null;
  name: string | null;
}
interface iUserState {
  user: iUser | null;
  loading: boolean;
}

interface IUserStore {
  userState: iUserState;
  updateState(userState: iUserState): void;
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

// why I did not separet the state  and used one object
// because if you use multiple values and multiple udpate funciton to that values
// you will use these function separtely e.g. `updateLoading(false) , updateUser(user)`
// this will cuz two renders instead of one , so udpating the two values one time
// will be more efficient
export const useCurrentUser = create<IUserStore>((set) => {
  return {
    userState: {
      loading: true,
      user: null,
    },
    updateState(userState) {
      set((state) => ({ userState: { ...state.userState, ...userState } }));
    },
  };
});

interface Icounter {
  counter: number;
  updateCounter(couter: number): void;
}
export const useCurrentCounter = create<Icounter>((set) => {
  return {
    counter: 0,
    updateCounter(counter: number) {
      set((state) => ({ ...state, counter: counter }));
    },
  };
});

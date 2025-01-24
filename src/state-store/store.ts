import { tChannel, tmember, tWorkspace } from "@/types/common-types";
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

interface iCreateChannelModal {
  isOpen: boolean;
  setOpen(open: boolean): void;
}

export const useCreateChannelModal = create<iCreateChannelModal>((set) => {
  return {
    isOpen: false,
    setOpen(open: boolean) {
      set({ isOpen: open });
    },
  };
});

interface iCurrentChannels {
  currentChannlesState: {
    isLoading: boolean;
    currentChannels: tChannel[] | null;
  };

  updateCurrentChannels(channels: tChannel[] | null): void;
}

export const useCurrentChannels = create<iCurrentChannels>((set) => {
  return {
    currentChannlesState: {
      currentChannels: null,
      isLoading: true,
    },
    updateCurrentChannels(channels: tChannel[] | null) {
      set((state) => ({
        currentChannlesState: {
          ...state,
          currentChannels: channels,
          isLoading: false,
        },
      }));
    },
  };
});

interface iCurrentMember {
  currentMemberState: {
    loading: boolean;
    member: null | tmember;
  };
  updateCurrentMemberState(member: tmember | null): void;
}

export const useCurrentMember = create<iCurrentMember>((set) => {
  return {
    currentMemberState: {
      loading: false,
      member: null,
    },
    updateCurrentMemberState(member) {
      set((state) => ({
        currentMemberState: { ...state, loading: false, member },
      }));
    },
  };
});

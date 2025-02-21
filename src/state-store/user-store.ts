import { tWorkspaceMembers } from "@/types/common-types";
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
  resetData(): void;
}

// why I did not separet the state  and used one object
// because if you use multiple values and multiple udpate funciton to that values
// you will use these function separtely e.g. `updateLoading(false) , updateUser(user)`
// this will cuz two renders instead of one , so udpating the two values one time
// will be more efficient
export const useCurrentUser = create<IUserStore>((set) => {
  return {
    resetData() {
      set((state) => {
        return {
          ...state,
          userState: {
            loading: true,
            user: null,
          },
        };
      });
    },
    userState: {
      loading: true,
      user: null,
    },
    updateState(userState) {
      set((state) => ({ userState: { ...state.userState, ...userState } }));
    },
  };
});

interface IworkspaceMembers {
  currentWorkspaceMembers: tWorkspaceMembers[] | null;
  isLoading: boolean;
  updateCurrentWorkspaceMembers(members: tWorkspaceMembers[] | null): void;
}

export const useCurrentWorkspaceMembers = create<IworkspaceMembers>((set) => {
  return {
    currentWorkspaceMembers: null,
    isLoading: true,
    updateCurrentWorkspaceMembers(members) {
      set((state) => {
        return {
          ...state,
          isLoading: false,
          currentWorkspaceMembers: members,
        };
      });
    },
  };
});

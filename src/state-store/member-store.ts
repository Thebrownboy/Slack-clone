import { tmember } from "@/types/common-types";
import { create } from "zustand";

interface iCurrentMember {
  currentMemberState: {
    loading: boolean;
    member: null | tmember;
  };
  updateCurrentMemberState(member: tmember | null): void;
  resetData(): void;
}

export const useCurrentMember = create<iCurrentMember>((set) => {
  return {
    resetData() {
      set((state) => {
        return {
          ...state,
          currentMemberState: {
            loading: true,
            member: null,
          },
        };
      });
    },
    currentMemberState: {
      loading: true,
      member: null,
    },
    updateCurrentMemberState(member) {
      set((state) => ({
        currentMemberState: { ...state, loading: false, member },
      }));
    },
  };
});

import { create } from "zustand";
import { useCurrentThreadData } from "./thread-messages";

interface ICurrentMemberProfile {
  currentMemberProfileId: string | null;
  updateCurrentMemberProfileId: (newMemberId: string | null) => void;
}
export const useCurrentMemberProfile = create<ICurrentMemberProfile>((set) => {
  return {
    currentMemberProfileId: null,

    updateCurrentMemberProfileId(newMemberId) {
      useCurrentThreadData.setState((state) => {
        return {
          ...state,
          parentMessageId: null,
          parentMessageIndex: null,
          currentThreadData: {
            skip: 0,
            messages: [],
          },
        };
      });
      set((state) => {
        return {
          ...state,
          currentMemberProfileId: newMemberId,
        };
      });
    },
  };
});

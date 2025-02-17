import { tChannel } from "@/types/common-types";
import { create } from "zustand";

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
  resetData(): void;
}

export const useCurrentChannels = create<iCurrentChannels>((set) => {
  return {
    resetData() {
      set((state) => {
        return {
          ...state,
          currentChannlesState: {
            currentChannels: null,
            isLoading: true,
          },
        };
      });
    },
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

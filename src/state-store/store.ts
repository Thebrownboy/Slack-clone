import { create } from "zustand";

interface iCreateWorkspaceModal {
  isOpen: boolean;
  setOpen(open: boolean): void;
}

export const useWorkSpaceStore = create<iCreateWorkspaceModal>((set) => {
  return {
    isOpen: false,
    setOpen(open: boolean) {
      set({ isOpen: open });
    },
  };
});

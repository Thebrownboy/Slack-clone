import {
  tChannel,
  tFulldataMessage,
  tmember,
  tWorkspace,
} from "@/types/common-types";
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

interface IChannelMesages {
  currentChannelsMessages: Record<string, tFulldataMessage[]>;
  editMessage: (
    channelId: string,
    index: number,
    newBody: string,
    updateTime: Date
  ) => void;
  deleteMessage: (channelId: string, index: number) => void;
  addNewMessage: (channelId: string, message: tFulldataMessage) => void;
  toggleReactionOnMessage: (
    channel: string,
    index: number,
    value: string,
    memberId: string
  ) => void;
  updateMessages: (channel: string, messages: tFulldataMessage[]) => void;
}

export const useCurrentMessages = create<IChannelMesages>((set) => {
  return {
    currentChannelsMessages: {},
    editMessage(channelId, index, newBody, updateTime: Date) {
      set((state) => {
        const editedMessage = state.currentChannelsMessages[channelId][index];
        if (editedMessage?.body) {
          editedMessage.body = newBody;
          editedMessage.updatedAt = updateTime;
        }
        let channelMessages = state.currentChannelsMessages[channelId];
        channelMessages = [
          ...channelMessages.slice(0, index),
          editedMessage,
          ...channelMessages.slice(index + 1),
        ];
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: channelMessages,
          },
        };
      });
    },
    deleteMessage(channelId, index) {
      set((state) => {
        let channelMessages = state.currentChannelsMessages[channelId];
        channelMessages = [
          ...channelMessages.slice(0, index),
          ...channelMessages.slice(index + 1),
        ];
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: channelMessages,
          },
        };
      });
    },
    updateMessages(channelId, messages) {
      set((state) => ({
        ...state,
        currentChannelsMessages: {
          ...state.currentChannelsMessages,
          [channelId]: messages,
        },
      }));
    },
    currentChannelMessages: {
      channelId: null,
      messages: [],
    },
    toggleReactionOnMessage: (channelId, index, value, memberId) => {
      set((state) => {
        console.log(index, value, memberId);
        const editedMessage = state.currentChannelsMessages[channelId][index];
        const reactionSize = editedMessage?.reactions.length || 0;

        if (!reactionSize) {
          editedMessage?.reactions.push({
            count: 1,
            membersIds: [memberId],
            value,
          });
        } else {
          let found = false;
          for (let i = 0; i < reactionSize; i++) {
            if (editedMessage?.reactions[i].value === value) {
              found = true;

              if (editedMessage?.reactions[i].membersIds.includes(memberId)) {
                const deletedIndex =
                  editedMessage?.reactions[i].membersIds.indexOf(memberId);
                editedMessage?.reactions[i].membersIds.splice(deletedIndex);
                if (editedMessage && editedMessage.reactions) {
                  editedMessage.reactions[i].count--;
                  if (editedMessage.reactions[i].count === 0) {
                    editedMessage.reactions = [
                      ...editedMessage.reactions.slice(0, i),
                      ...editedMessage.reactions.slice(i + 1),
                    ];
                  }
                }
              } else {
                editedMessage?.reactions[i].membersIds.push(memberId);
                editedMessage.reactions[i].count++;
              }
              break;
            }
          }
          if (!found) {
            editedMessage?.reactions.push({
              count: 1,
              membersIds: [memberId],
              value,
            });
          }
        }
        let channelMessages = state.currentChannelsMessages[channelId];
        channelMessages = [
          ...channelMessages.slice(0, index),
          editedMessage,
          ...channelMessages.slice(index + 1),
        ];
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: channelMessages,
          },
        };
      });
    },

    addNewMessage: (channelId, message: tFulldataMessage) => {
      set((state) => ({
        ...state,
        currentChannelsMessages: {
          ...state.currentChannelsMessages,
          [channelId]: [
            message,
            ...(state.currentChannelsMessages[channelId] || []),
          ],
        },
      }));
    },
  };
});

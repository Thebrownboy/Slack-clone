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
  increaseSkip: () => void;
  skip: number;
  updateSkip: (newSkip: number, channelId: string) => void;
  currentChannelsMessages: Record<
    string,
    { messages: tFulldataMessage[]; skip: number }
  >;
  editMessage: (
    channelId: string,
    index: number,
    newBody: string,
    updateTime: Date,
    activeChannel: boolean
  ) => void;
  deleteMessage: (
    channelId: string,
    index: number,
    activeChannel: boolean
  ) => void;
  addNewMessage: (
    channelId: string,
    message: tFulldataMessage,
    activeChannel: boolean
  ) => void;
  toggleReactionOnMessage: (
    channel: string,
    index: number,
    value: string,
    memberId: string,
    activeChannel: boolean
  ) => void;
  updateMessages: (channel: string, messages: tFulldataMessage[]) => void;
}

export const useCurrentMessages = create<IChannelMesages>((set) => {
  return {
    increaseSkip() {
      set((state) => {
        return {
          ...state,
          skip: state.skip + 1,
        };
      });
    },
    skip: 0,
    updateSkip(newSkip, channelId) {
      set((state) => {
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: {
              ...state.currentChannelsMessages[channelId],
              skip: newSkip,
            },
          },
        };
      });
    },
    currentChannelsMessages: {},
    editMessage(channelId, index, newBody, updateTime: Date, activeChannel) {
      set((state) => {
        if (
          !activeChannel &&
          !state.currentChannelsMessages[channelId].messages
        ) {
          return state;
        }

        const editedMessage =
          state.currentChannelsMessages[channelId].messages[index];
        if (editedMessage?.body) {
          editedMessage.body = newBody;
          editedMessage.updatedAt = updateTime;
        }
        let channelMessages = state.currentChannelsMessages[channelId].messages;
        channelMessages = [
          ...channelMessages.slice(0, index),
          editedMessage,
          ...channelMessages.slice(index + 1),
        ];
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: {
              skip: state.currentChannelsMessages[channelId].skip,
              messages: channelMessages,
            },
          },
        };
      });
    },
    deleteMessage(channelId, index, activeChannel) {
      set((state) => {
        if (
          !activeChannel &&
          !state.currentChannelsMessages[channelId].messages
        ) {
          return state;
        }
        let channelMessages = state.currentChannelsMessages[channelId].messages;
        channelMessages = [
          ...channelMessages.slice(0, index),
          ...channelMessages.slice(index + 1),
        ];
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: {
              skip: state.currentChannelsMessages[channelId].skip - 1,
              messages: channelMessages,
            },
          },
        };
      });
    },
    updateMessages(channelId, messages) {
      set((state) => ({
        ...state,
        currentChannelsMessages: {
          ...state.currentChannelsMessages,
          [channelId]: {
            skip: state.currentChannelsMessages[channelId]?.skip || 0,
            messages: [
              ...(state.currentChannelsMessages[channelId]?.messages || []),
              ...messages,
            ],
          },
        },
      }));
    },
    currentChannelMessages: {
      channelId: null,
      messages: [],
    },
    toggleReactionOnMessage: (
      channelId,
      index,
      value,
      memberId,
      activeChannel
    ) => {
      set((state) => {
        // you are inactive and also , you did not load any messages
        if (
          !activeChannel &&
          !state.currentChannelsMessages[channelId].messages
        ) {
          return state;
        }
        const editedMessage =
          state.currentChannelsMessages[channelId].messages[index];
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
        let channelMessages = state.currentChannelsMessages[channelId].messages;
        channelMessages = [
          ...channelMessages.slice(0, index),
          editedMessage,
          ...channelMessages.slice(index + 1),
        ];
        return {
          ...state,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,
            [channelId]: {
              messages: channelMessages,
              skip: state.currentChannelsMessages[channelId].skip,
            },
          },
        };
      });
    },
    // active channel will be used for one case ,  if the user load some messages in a channel
    // and then go to another channel in the same workspace, the channel will not be active in that case
    // if the user previously visited this channel , then any comming messages will be inserted in the array of the messages ,
    // however if the user did  not open the channel , all the messages will not be inserted and it will be updated after he visits the
    // channel by the first data fetch
    addNewMessage: (channelId, message: tFulldataMessage, activeChannel) => {
      set((state) => {
        // the user did not open the channel and not active
        if (!activeChannel && !state.currentChannelsMessages[channelId]) {
          return state;
        }
        console.log(state.skip);
        return {
          ...state,
          skip: state.skip + 1,
          currentChannelsMessages: {
            ...state.currentChannelsMessages,

            [channelId]: {
              skip: state.currentChannelsMessages[channelId].skip + 1,
              messages: [
                message,
                ...state.currentChannelsMessages[channelId].messages,
              ],
            },
          },
        };
      });
    },
  };
});

interface iCurrentThreadMessage {
  parentMessage: string | null;
  threadReplies: tFulldataMessage[] | null;
  updateParentMessage: (newParentMessage: string | null) => void;
  updateThreadReplies: (replies: tFulldataMessage[]) => void;
  addOneReply: (reply: tFulldataMessage) => void;
  putThreadReplies: (
    replies: tFulldataMessage[] | null,
    parentMessage: string | null
  ) => void;
}

export const useCurrentRepiles = create<iCurrentThreadMessage>((set) => {
  return {
    addOneReply(reply) {
      set((state) => {
        console.log(
          "this is the parenet messmage",
          reply?.parentMessageId,
          state.parentMessage
        );
        if (reply?.parentMessageId !== state.parentMessage) {
          return state;
        }
        return {
          ...state,
          threadReplies: [reply, ...(state.threadReplies || [])],
        };
      });
    },
    updateParentMessage(newParentMessage) {
      set((state) => {
        return {
          ...state,
          parentMessage: newParentMessage,
        };
      });
    },
    parentMessage: null,
    putThreadReplies: (replies, parentMessage) => {
      set((state) => {
        return {
          ...state,
          threadReplies: replies,
          parentMessage,
        };
      });
    },
    threadReplies: [],
    updateThreadReplies(replies) {
      set((state) => {
        return {
          ...state,
          threadReplies: [...(state.threadReplies || []), ...(replies || [])],
        };
      });
    },
  };
});

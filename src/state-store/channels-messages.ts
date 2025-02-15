import { tFulldataMessage } from "@/types/common-types";
import { create } from "zustand";
import { useCurrentThreadData } from "./thread-messages";

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
        const currentIndex = useCurrentThreadData.getState().parentMessageIndex;
        useCurrentThreadData.setState((state) => {
          return {
            ...state,
            parentMessageIndex: !currentIndex
              ? null
              : currentIndex !== 0
              ? currentIndex - 1
              : 0,
          };
        });
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
        const currentIndex = useCurrentThreadData.getState().parentMessageIndex;
        useCurrentThreadData.setState((state) => {
          return {
            ...state,
            parentMessageIndex: currentIndex ? currentIndex + 1 : null,
          };
        });
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

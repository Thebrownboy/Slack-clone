import { tFulldataMessage } from "@/types/common-types";
import { create } from "zustand";
import { useCurrentThreadData } from "./thread-messages";

interface IConversationMesages {
  currentConversationId: string;
  updateConversationId: (newConversationId: string) => void;
  increaseSkip: () => void;
  skip: number;
  updateSkip: (newSkip: number, conversationId: string) => void;
  currentConversationsMessages: Record<
    string,
    { messages: tFulldataMessage[]; skip: number }
  >;
  editMessage: (
    conversationId: string,
    index: number,
    newBody: string,
    updateTime: Date
  ) => void;
  deleteMessage: (conversationId: string, index: number) => void;
  addNewMessage: (conversationId: string, message: tFulldataMessage) => void;
  toggleReactionOnMessage: (
    conversationId: string,
    index: number,
    value: string,
    memberId: string
  ) => void;
  updateMessages: (channel: string, messages: tFulldataMessage[]) => void;
  resetData(): void;
}

export const useCurrentConversationMessages = create<IConversationMesages>(
  (set) => {
    return {
      resetData() {
        set((state) => {
          return {
            ...state,
            currentConversationId: "",
            skip: 0,
            currentConversationsMessages: {},
            currentChannelMessages: {
              conversationId: null,
              messages: [],
            },
          };
        });
      },
      increaseSkip() {
        set((state) => {
          return {
            ...state,
            skip: state.skip + 1,
          };
        });
      },
      currentConversationId: "",
      updateConversationId(newConversationId) {
        set((state) => {
          return {
            ...state,
            currentConversationId: newConversationId,
          };
        });
      },
      skip: 0,
      updateSkip(newSkip, conversationId) {
        set((state) => {
          return {
            ...state,
            currentConversationsMessages: {
              ...state.currentConversationsMessages,
              [conversationId]: {
                ...state.currentConversationsMessages[conversationId],
                skip: newSkip,
              },
            },
          };
        });
      },
      currentConversationsMessages: {},
      editMessage(conversationId, index, newBody, updateTime: Date) {
        set((state) => {
          const activeChannel = conversationId === state.currentConversationId;
          if (
            !activeChannel &&
            !state.currentConversationsMessages[conversationId].messages
          ) {
            return state;
          }

          const editedMessage =
            state.currentConversationsMessages[conversationId].messages[index];
          if (editedMessage?.body) {
            editedMessage.body = newBody;
            editedMessage.updatedAt = updateTime;
          }

          let channelMessages =
            state.currentConversationsMessages[conversationId].messages;
          channelMessages = [
            ...channelMessages.slice(0, index),
            editedMessage,
            ...channelMessages.slice(index + 1),
          ];

          return {
            ...state,
            currentConversationsMessages: {
              ...state.currentConversationsMessages,
              [conversationId]: {
                skip: state.currentConversationsMessages[conversationId].skip,
                messages: channelMessages,
              },
            },
          };
        });
      },
      deleteMessage(conversationId, index) {
        set((state) => {
          const activeChannel = conversationId === state.currentConversationId;
          if (
            !activeChannel &&
            !state.currentConversationsMessages[conversationId]?.messages
          ) {
            return state;
          }
          let channelMessages =
            state.currentConversationsMessages[conversationId].messages;
          channelMessages = [
            ...channelMessages.slice(0, index),
            ...channelMessages.slice(index + 1),
          ];

          const currentIndex =
            useCurrentThreadData.getState().parentMessageIndex;
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
            currentConversationsMessages: {
              ...state.currentConversationsMessages,
              [conversationId]: {
                skip:
                  state.currentConversationsMessages[conversationId].skip - 1,
                messages: channelMessages,
              },
            },
          };
        });
      },
      updateMessages(conversationId, messages) {
        set((state) => ({
          ...state,
          currentConversationsMessages: {
            ...state.currentConversationsMessages,
            [conversationId]: {
              skip:
                state.currentConversationsMessages[conversationId]?.skip || 0,
              messages: [
                ...(state.currentConversationsMessages[conversationId]
                  ?.messages || []),
                ...messages,
              ],
            },
          },
        }));
      },
      currentChannelMessages: {
        conversationId: null,
        messages: [],
      },
      toggleReactionOnMessage: (conversationId, index, value, memberId) => {
        set((state) => {
          // you are inactive and also , you did not load any messages
          const activeChannel = conversationId === state.currentConversationId;
          if (
            !activeChannel &&
            !state.currentConversationsMessages[conversationId].messages
          ) {
            return state;
          }
          const editedMessage =
            state.currentConversationsMessages[conversationId].messages[index];
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
          let channelMessages =
            state.currentConversationsMessages[conversationId].messages;

          channelMessages = [
            ...channelMessages.slice(0, index),
            editedMessage,
            ...channelMessages.slice(index + 1),
          ];
          return {
            ...state,
            currentConversationsMessages: {
              ...state.currentConversationsMessages,
              [conversationId]: {
                messages: channelMessages,
                skip: state.currentConversationsMessages[conversationId].skip,
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
      addNewMessage: (conversationId, message: tFulldataMessage) => {
        set((state) => {
          const activeChannel = conversationId === state.currentConversationId;
          // the user did not open the channel and not active
          if (
            !activeChannel &&
            !state.currentConversationsMessages[conversationId]
          ) {
            return state;
          }
          const currentIndex =
            useCurrentThreadData.getState().parentMessageIndex;
          useCurrentThreadData.setState((state) => {
            return {
              ...state,
              parentMessageIndex: currentIndex ? currentIndex + 1 : null,
            };
          });
          return {
            ...state,
            skip: (state.skip || 0) + 1,
            currentConversationsMessages: {
              ...state.currentConversationsMessages,

              [conversationId]: {
                skip:
                  (state.currentConversationsMessages[conversationId]?.skip ||
                    0) + 1,
                messages: [
                  message,
                  ...(state.currentConversationsMessages[conversationId]
                    ?.messages || []),
                ],
              },
            },
          };
        });
      },
    };
  }
);

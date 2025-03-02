import { tFulldataMessage } from "@/types/common-types";
import { create } from "zustand";
import { useCurrentMemberProfile } from "./member-profile.store";
import { useCurrentMessages } from "./channels-messages";
import { useCurrentConversationMessages } from "./conversation-store";

interface iCurrentThreadData {
  toggleReactionOnAThread: (
    parentMessageId: string,
    messageIndex: number,
    memberId: string,
    value: string
  ) => void;
  parentMessageId: string | null;
  parentMessageIndex: number | null;
  updateParentMessageId: (parentMessageId: string | null) => void;
  updateParentMessageIndex: (parentMessageIndex: number | null) => void;
  currentThreadData: {
    messages: tFulldataMessage[];
    skip: number;
  };
  addReplyOnCurrentThread: (reply: tFulldataMessage) => void;
  restData: () => void;
  updateSkip: (skip: number) => void;
  updateCurrentThreadData: (messages: tFulldataMessage[]) => void;
  editThreadMessage: (
    parentMessageId: string,
    messageIndex: number,
    newBody: string,
    updateTime: Date
  ) => void;

  deleteMessage: (
    parentMessageId: string,
    messageIndex: number,
    channelId: string,
    conversationId: string
  ) => void;
}

export const useCurrentThreadData = create<iCurrentThreadData>((set) => {
  return {
    deleteMessage(parentMessageId, messageIndex, channelId, conversationId) {
      set((state) => {
        if (
          channelId &&
          state.parentMessageIndex !== null &&
          state.parentMessageIndex !== undefined
        ) {
          const currentParentMessage =
            useCurrentMessages.getState().currentChannelsMessages[channelId]
              .messages[state.parentMessageIndex];
          if (currentParentMessage && !currentParentMessage?.threadCount) {
            currentParentMessage.threadCount = 0;
          } else if (currentParentMessage && currentParentMessage.threadCount) {
            currentParentMessage.threadCount -= 1;
          }
          if (currentParentMessage) {
            // if the delete message is the last one , you should update the time stamp
            if (messageIndex === 0) {
              // you are delete the last message

              currentParentMessage.threadTimestamp = state.currentThreadData
                .messages[messageIndex + 1]?.updatedAt
                ? (state.currentThreadData.messages[messageIndex + 1]
                    ?.updatedAt as Date)
                : (state.currentThreadData.messages[messageIndex + 1]
                    ?.creationTime as Date);
            }
          }
          const parentMessageIndex = state.parentMessageIndex;
          useCurrentMessages.setState((state) => {
            return {
              ...state,
              currentChannelsMessages: {
                ...state.currentChannelsMessages,
                [channelId]: {
                  ...state.currentChannelsMessages[channelId],
                  messages: [
                    ...state.currentChannelsMessages[channelId].messages.slice(
                      0,
                      parentMessageIndex
                    ),
                    currentParentMessage,
                    ...state.currentChannelsMessages[channelId].messages.slice(
                      parentMessageIndex + 1
                    ),
                  ],
                },
              },
            };
          });
        }
        if (
          conversationId &&
          state.parentMessageIndex !== null &&
          state.parentMessageIndex !== undefined
        ) {
          const currentParentMessage =
            useCurrentConversationMessages.getState()
              .currentConversationsMessages[conversationId].messages[
              state.parentMessageIndex
            ];
          if (currentParentMessage && !currentParentMessage?.threadCount) {
            currentParentMessage.threadCount = 0;
          } else if (currentParentMessage && currentParentMessage.threadCount) {
            currentParentMessage.threadCount -= 1;
          }
          if (currentParentMessage && messageIndex === 0) {
            // if the delete message is the last one , you should update the time stamp

            // you are delete the last message

            currentParentMessage.threadTimestamp = state.currentThreadData
              .messages[messageIndex + 1]?.updatedAt
              ? (state.currentThreadData.messages[messageIndex + 1]
                  ?.updatedAt as Date)
              : (state.currentThreadData.messages[messageIndex + 1]
                  ?.creationTime as Date);
          }
          const parentMessageIndex = state.parentMessageIndex;
          useCurrentConversationMessages.setState((state) => {
            return {
              ...state,
              currentConversationsMessages: {
                ...state.currentConversationsMessages,
                [channelId]: {
                  ...state.currentConversationsMessages[conversationId],
                  messages: [
                    ...state.currentConversationsMessages[
                      conversationId
                    ].messages.slice(0, parentMessageIndex),
                    currentParentMessage,
                    ...state.currentConversationsMessages[
                      conversationId
                    ].messages.slice(parentMessageIndex + 1),
                  ],
                },
              },
            };
          });
        }
        if (state.parentMessageId !== parentMessageId) {
          return state;
        }
        // TODO: after deletion you should update the number of replies
        // if (reply?.channelId && state.parentMessageIndex) {
        //   const currentParentMessage =
        //     useCurrentMessages.getState().currentChannelsMessages[
        //       reply.channelId
        //     ].messages[state.parentMessageIndex];
        //   if (currentParentMessage && !currentParentMessage?.threadCount) {
        //     currentParentMessage.threadCount = 1;
        //   } else if (currentParentMessage && currentParentMessage.threadCount) {
        //     currentParentMessage.threadCount += 1;
        //   }
        //   if (currentParentMessage)
        //     currentParentMessage.threadTimestamp = new Date();
        // }

        let channelMessages = state.currentThreadData.messages;
        channelMessages = [
          ...(channelMessages?.slice(0, messageIndex) || []),
          ...channelMessages?.slice(messageIndex + 1),
        ];
        return {
          ...state,
          currentThreadData: {
            skip: state.currentThreadData.skip - 1,
            messages: channelMessages,
          },
        };
      });
    },
    editThreadMessage(
      parentMessageId,
      messageIndex,
      newBody,
      updateTime: Date
    ) {
      set((state) => {
        if (parentMessageId !== state.parentMessageId) {
          return state;
        }

        const editedMessage = state.currentThreadData.messages[messageIndex];
        if (editedMessage?.body) {
          editedMessage.body = newBody;
          editedMessage.updatedAt = updateTime;
        }
        let channelMessages = state.currentThreadData.messages;
        channelMessages = [
          ...channelMessages.slice(0, messageIndex),
          editedMessage,
          ...channelMessages.slice(messageIndex + 1),
        ];

        return {
          ...state,
          currentThreadData: {
            ...state.currentThreadData,
            messages: channelMessages,
          },
        };
      });
    },
    toggleReactionOnAThread(parentMessageId, messageIndex, memberId, value) {
      set((state) => {
        if (parentMessageId !== state.parentMessageId) return state;
        const editedMessage = state.currentThreadData.messages[messageIndex];
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
        let channelMessages = state.currentThreadData.messages;
        channelMessages = [
          ...channelMessages.slice(0, messageIndex),
          editedMessage,
          ...channelMessages.slice(messageIndex + 1),
        ];
        return {
          ...state,
          currentThreadData: {
            ...state.currentThreadData,
            messages: channelMessages,
          },
        };
      });
    },
    updateCurrentThreadData(messages) {
      set((state) => {
        return {
          ...state,
          currentThreadData: {
            ...state.currentThreadData,
            messages: [...state.currentThreadData.messages, ...messages],
          },
        };
      });
    },
    updateSkip(skip) {
      set((state) => {
        return {
          ...state,
          currentThreadData: {
            ...state.currentThreadData,
            skip,
          },
        };
      });
    },
    restData() {
      set((state) => {
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
    },
    parentMessageId: null,
    parentMessageIndex: null,
    currentThreadData: {
      skip: 0,
      messages: [],
    },
    addReplyOnCurrentThread(reply) {
      set((state) => {
        if (
          reply?.channelId &&
          reply?.messageIndex !== null &&
          reply.messageIndex !== undefined
        ) {
          const currentParentMessage =
            useCurrentMessages.getState().currentChannelsMessages[
              reply.channelId
            ].messages[reply.messageIndex];
          if (currentParentMessage && !currentParentMessage?.threadCount) {
            currentParentMessage.threadCount = 1;
          } else if (currentParentMessage && currentParentMessage.threadCount) {
            currentParentMessage.threadCount += 1;
          }
          if (currentParentMessage)
            currentParentMessage.threadTimestamp = new Date();

          useCurrentMessages.setState((state) => {
            return {
              ...state,
              currentChannelsMessages: {
                ...state.currentChannelsMessages,
                [reply.channelId || ""]: {
                  ...state.currentChannelsMessages[reply.channelId || ""],
                  messages: [
                    ...state.currentChannelsMessages[
                      reply.channelId || ""
                    ].messages.slice(0, reply.messageIndex),
                    currentParentMessage,
                    ...state.currentChannelsMessages[
                      reply.channelId || ""
                    ].messages.slice((reply.messageIndex as number) + 1),
                  ],
                },
              },
            };
          });
        }

        if (
          reply?.conversationId &&
          reply?.messageIndex !== null &&
          reply.messageIndex !== undefined
        ) {
          const currentParentMessage =
            useCurrentConversationMessages.getState()
              .currentConversationsMessages[reply.conversationId].messages[
              reply.messageIndex
            ];

          if (currentParentMessage && !currentParentMessage?.threadCount) {
            currentParentMessage.threadCount = 1;
          } else if (currentParentMessage && currentParentMessage.threadCount) {
            currentParentMessage.threadCount += 1;
          }
          if (currentParentMessage)
            currentParentMessage.threadTimestamp = new Date();

          useCurrentConversationMessages.setState((state) => {
            return {
              ...state,
              currentChannelsMessages: {
                ...state.currentConversationsMessages,
                [reply.channelId || ""]: {
                  ...state.currentConversationsMessages[
                    reply.conversationId || ""
                  ],
                  messages: [
                    ...state.currentConversationsMessages[
                      reply.conversationId || ""
                    ].messages.slice(0, reply.messageIndex),
                    currentParentMessage,
                    ...state.currentConversationsMessages[
                      reply.conversationId || ""
                    ].messages.slice((reply.messageIndex as number) + 1),
                  ],
                },
              },
            };
          });
        }

        if (reply?.parentMessageId !== state.parentMessageId) return state;

        return {
          ...state,
          currentThreadData: {
            skip: state.currentThreadData.skip + 1,
            messages: [reply, ...state.currentThreadData.messages],
          },
        };
      });
    },

    updateParentMessageId(parentMessageId) {
      // if you will open the thread , just close the profile
      useCurrentMemberProfile.setState((state) => {
        return {
          ...state,
          currentMemberProfileId: null,
        };
      });
      set((state) => {
        return {
          ...state,
          parentMessageId,
        };
      });
    },
    updateParentMessageIndex(parentMessageIndex) {
      set((state) => {
        return {
          ...state,
          parentMessageIndex,
        };
      });
    },
  };
});

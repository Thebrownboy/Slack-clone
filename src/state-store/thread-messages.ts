import { tFulldataMessage } from "@/types/common-types";
import { create } from "zustand";
import { useCurrentMemberProfile } from "./member-profile.store";

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

  deleteMessage: (parentMessageId: string, messageIndex: number) => void;
}

export const useCurrentThreadData = create<iCurrentThreadData>((set) => {
  return {
    deleteMessage(parentMessageId, messageIndex) {
      set((state) => {
        if (state.parentMessageId !== parentMessageId) {
          return state;
        }

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

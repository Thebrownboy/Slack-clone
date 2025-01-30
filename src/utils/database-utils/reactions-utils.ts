import "server-only";
import { getMember } from "./general-utils";
import { db } from "@/lib/db";

export const toggleReaction = async ({
  messageId,
  userId,
  value,
  workspaceId,
}: {
  messageId: string;
  value: string;
  userId: string;
  workspaceId: string;
}) => {
  if (!userId) return null;

  const message = await db.message.findUnique({
    where: {
      id: messageId,
    },
  });
  if (!message) return null;
  const member = await getMember(userId, workspaceId);
  if (!member) return null;

  const messageReactionFromUser = await db.reactions.findMany({
    where: {
      workspaceId,
      memberId: message.memberId,
      messageId: message.id,
      value: value,
    },
  });

  if (messageReactionFromUser.length) {
    await db.reactions.delete({
      where: {
        id: messageReactionFromUser[0].id,
      },
    });

    return {
      reactionId: messageReactionFromUser[0].id,
      exsiting: true,
    };
  } else {
    const newReaction = await db.reactions.create({
      data: {
        value,
        messageId,
        memberId: message.memberId,
        workspaceId,
      },
    });
    return {
      reactionId: newReaction.id,
      exsiting: false,
    };
  }
};

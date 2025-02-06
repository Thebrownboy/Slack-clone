import { db } from "@/lib/db";
import "server-only";

export const createOrGetConversation = async ({
  otherMemberId,
  userId,
  workspaceId,
}: {
  workspaceId: string;
  otherMemberId: string;
  userId: string;
}) => {
  if (!userId) {
    return null;
  }
  const currentMember = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });

  if (!currentMember) {
    return null;
  }
  const otherMember = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId: otherMemberId,
        workspaceId,
      },
    },
  });

  if (!otherMember) {
    return null;
  }

  const existingConversation = await db.conversation.findFirst({
    where: {
      workspaceId, // Match the workspaceId
      OR: [
        {
          AND: [
            { memberOneId: currentMember.userId },
            { memberTwoId: otherMember.userId },
          ],
        },
        {
          AND: [
            { memberOneId: otherMember.userId },
            { memberTwoId: currentMember.userId },
          ],
        },
      ],
    },
  });

  if (existingConversation) {
    return existingConversation;
  }

  const conversation = await db.conversation.create({
    data: {
      workspaceId,
      memberOneId: currentMember.userId,
      memberTwoId: otherMember.userId,
    },
  });

  if (!conversation) {
    return null;
  }
  return conversation;
};

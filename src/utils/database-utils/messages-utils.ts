import { db } from "@/lib/db";
import "server-only";
import { getMember } from "./general-utils";
import pusherServer from "@/lib/pusher";
const populateUser = async (userId: string | null) => {
  if (!userId) return null;
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, updatedAt, emailVerified, createdAt, ...restData } = user;
    return restData;
  } else {
    return null;
  }
};

const populateReactions = async (messageId: string) => {
  return db.reactions.findMany({
    where: {
      messageId,
    },
  });
};

// TODO : to be improved , instead of getting all the message to get the count of the replies , you can only get the last message , by the creation time and get the count only
//  if we have replies sent to a message we have to add these repiles to the body of the returned message
const populateThread = async (messageId: string) => {
  // getting the messages that thier parent Id is the messages iteself , 'the repiles of a message with id ' = 'the messages with parentId = id '
  const messages = await db.message.findMany({
    where: {
      parentMessageId: messageId,
    },
  });
  // instead of adding a replies table , we can have a parentId insie the messages table

  if (messages.length === 0) {
    // we will return an object for the repiles
    // count of the repiles , the image of the last one put a reply (just for UI ) and the timpestamp for the last message
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }
  const lastMessage = messages[messages.length - 1];
  // memberId and workspaceId , will not be null at all
  const lastMessageMember = await getMember(
    lastMessage.memberId,
    lastMessage.workspaceId
  );

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(lastMessageMember.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestamp: lastMessage.creationTime,
  };
};
export async function createMessage({
  body,
  userId,
  workspaceId,
  channelId,
  imageId,
  parentMessageId,
  conversationId,
}: {
  userId: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  body: string;
  imageId?: string;
  conversationId?: string;
  otherMemberId?: string;
}) {
  if (!userId || !workspaceId) return null;

  const member = await getMember(userId, workspaceId);
  if (!member) return null;

  const message = await db.message.create({
    data: {
      memberId: member.userId,
      body: body,
      imageId,
      channelId: channelId || null,
      workspaceId: workspaceId,
      parentMessageId: parentMessageId || null,
      conversationId: conversationId,
    },
  });
  return message;
}

export async function uploadImage(file: File | null) {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file); // 'file' is your File object from input
  formData.append("upload_preset", process.env.CLOUDINARY_PRESET_NAME || "");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadedImage = await response.json();

    const image = await db.images.create({
      data: {
        displayName: uploadedImage.display_name,
        height: uploadedImage.height,
        width: uploadedImage.width,
        publicId: uploadedImage.public_id,
        URL: uploadedImage.url,
        id: uploadedImage.asset_id,
      },
    });
    return image;
  } catch {
    return null;
  }
}

export async function editMessage({
  messageId,
  body,
  userId,
  workspaceId,
}: {
  messageId: string;
  body: string;
  userId: string;
  workspaceId: string;
}) {
  if (!userId) return null;

  const message = await db.message.findUnique({
    where: {
      id: messageId,
    },
  });
  if (!message) {
    return null;
  }

  const member = await getMember(userId, workspaceId);

  if (!member || member.userId !== message.memberId) return null;

  const updatedMessage = await db.message.update({
    where: {
      id: messageId,
    },
    data: {
      body,
    },
  });
  return updatedMessage;
}

export const getMessages = async (
  userId: string | null,
  channelId: string | undefined,
  conversationId: string | undefined,
  parentMessageId: string | undefined,
  skip: number,
  take = 10
) => {
  /**
   * I have only three options
   *  1- message in a channel , so I have the channel id
   *  2- message in a conversation , so I have the conversation id
   *  3- message that is a reply to another message , so I will have the parentMessage Id
   */
  if (!userId) return null;

  // TODO : edge case of the conversation id
  // it has no meaning !!
  let _conversationId = conversationId;
  //I a requesting the replies on a specific message
  if (!conversationId && !channelId && parentMessageId) {
    const parentMessage = await db.message.findUnique({
      where: {
        id: parentMessageId,
      },
    });
    // there is no situation that could have this combination
    if (!parentMessage) return null;

    _conversationId = parentMessage.conversationId || undefined;
  }

  const results = await db.message.findMany({
    where: {
      channelId,
      parentMessageId: parentMessageId ? parentMessageId : null,
      conversationId: conversationId ? _conversationId : null,
    },
    orderBy: {
      creationTime: "desc",
    },
    skip,
    take,
  });

  return {
    page: await Promise.all(
      results?.map(async (message) => {
        const member = await getMember(message.memberId, message.workspaceId);
        const user = member ? await populateUser(message.memberId) : null;

        if (!member || !user) {
          return null;
        }

        const reactions = await populateReactions(message.id);
        const thread = await populateThread(message.id);
        const image = await db.images.findUnique({
          where: {
            id: message.imageId || "",
          },
        });
        const URL = image?.URL;

        // normalizing the reactions
        //O(N)
        const reactionsMap: {
          [key: string]: { count: number; membersIds: string[] };
        } = {};
        for (let i = 0; i < reactions.length; i++) {
          if (!reactionsMap[reactions[i].value]) {
            reactionsMap[reactions[i].value] = {
              count: 1,
              membersIds: [reactions[i].memberId],
            };
          } else {
            reactionsMap[reactions[i].value].count++;
            reactionsMap[reactions[i].value].membersIds.push(
              reactions[i].memberId
            );
          }
        }
        // O(N^2)
        // const reactionsWithCount = reactions.map((reaction) => {
        //   return {
        //     ...reaction,
        //     count: reactions.filter((r) => reaction.value === reaction.value),
        //   };
        // });
        const normalizedReactions: {
          value: string;
          count: number;
          membersIds: string[];
        }[] = [];

        for (const key of Object.keys(reactionsMap)) {
          normalizedReactions.push({
            value: key,
            count: reactionsMap[key].count,
            membersIds: reactionsMap[key].membersIds,
          });
        }

        return {
          ...message,
          URL,
          member,
          user,
          reactions: normalizedReactions,
          threadCount: thread.count,
          threadImage: thread.image,
          threadTimestamp: thread.timestamp,
        };
      })
    ),
  };
};

export async function deleteMessage({
  messageId,
  userId,
  workspaceId,
}: {
  messageId: string;
  userId: string;
  workspaceId: string;
}) {
  if (!userId) return null;

  const message = await db.message.findUnique({
    where: {
      id: messageId,
    },
  });
  if (!message) {
    return null;
  }

  const member = await getMember(userId, workspaceId);
  // admin can delete any message
  if (
    !member ||
    (member.userId !== message.memberId && member.role !== "admin")
  )
    return null;

  const deletedMessage = db.message.delete({
    where: {
      id: messageId,
    },
  });

  return deletedMessage;
}

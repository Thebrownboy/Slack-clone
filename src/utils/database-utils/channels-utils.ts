import { db } from "@/lib/db";
import "server-only";
export async function getWorkspaceChannels(
  workspaceId: string,
  userId: string
) {
  // you should authorize the user on every function , but why so while the function will not be called except from
  // an authenticated user by the frontend?
  // the action could also be called by any request sender like postman and thunder client
  // so you should authorize every request by the user

  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (!member) {
    return null;
  }

  return await db.channels.findMany({
    where: {
      workspaceId,
    },
  });
}

const populateUser = async (userId: string) => {
  const user = await db.user.findUnique({ where: { id: userId } });
  return user;
};
export async function getWorkspaceMembers(workspaceId: string, userId: string) {
  if (!workspaceId || !userId) {
    return null;
  }
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (!member) {
    return null;
  }
  const data = await db.members.findMany({
    where: {
      workspaceId,
    },
  });
  const members = [];
  for (const member of data) {
    const user = await populateUser(member.userId);
    members.push({
      member,
      user: {
        email: user?.email,
        name: user?.name,
        id: user?.id,
        image: user?.image,
      },
    });
  }

  return members;
}

export async function createChannel(
  workspaceId: string,
  userId: string,
  channelName: string
) {
  if (!userId) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (!member || member.role !== "admin") {
    return null;
  }
  // if the user pypasses the rules
  const parsedName = channelName.replace(/\s+/g, "-").toLowerCase();

  const channel = await db.channels.create({
    data: {
      name: parsedName,
      workspaceId,
    },
  });

  return channel;
}

export async function getChannelNumber(userId: string, workspaceId: string) {
  if (!userId) {
    return null;
  }
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (!member) return null;

  const channelsNumber = await db.channels.count({
    where: {
      workspaceId,
    },
  });

  return {
    num: channelsNumber,
  };
}

export async function getChannelById(userId: string, channelId: string) {
  if (!userId) return null;

  const channel = await db.channels.findUnique({
    where: {
      id: channelId,
    },
  });
  if (!channel) return null;

  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: channel?.workspaceId,
      },
    },
  });
  if (!member) return null;

  return channel;
}

export async function editChannelName(
  userId: string,
  channelId: string,
  channelName: string
) {
  if (!userId || !channelId) return null;
  if (!channelName || channelName.length < 3) return null;
  const channel = await db.channels.findUnique({
    where: {
      id: channelId,
    },
  });
  if (!channel) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: channel?.workspaceId,
      },
    },
  });

  // any confirmation here is done for the case when the user is able to bypass the UI
  if (!member || member.role !== "admin") {
    return null;
  }

  const updatedChannel = await db.channels.update({
    where: {
      id: channelId,
    },
    data: {
      name: channelName,
    },
  });

  return updatedChannel;
}

export async function deleteChannel(userId: string, channelId: string) {
  if (!userId || !channelId) return null;
  const channel = await db.channels.findUnique({
    where: {
      id: channelId,
    },
  });
  if (!channel) return null;
  const member = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId: channel?.workspaceId,
      },
    },
  });

  // any confirmation here is done for the case when the user is able to bypass the UI
  if (!member || member.role !== "admin") {
    return null;
  }

  const deletedChannel = await db.channels.delete({
    where: {
      id: channelId,
    },
  });

  return deletedChannel;
}

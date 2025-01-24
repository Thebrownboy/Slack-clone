import { db } from "@/lib/db";
import "server-only";
import bcrypt from "bcryptjs";
import { tUpdatedWorkspace } from "@/types/common-types";
export const addNewUser = async (
  email: string,
  password: string,
  name: string
) => {
  const hasedPaswword = await bcrypt.hash(password, 10);
  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hasedPaswword,
      },
    });
    return {
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      sucess: false,
    };
  }
};

export async function findUserByEmail(email: string) {
  try {
    const user = await db.user.findFirst({
      where: { email },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function findUserById(id: string) {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  });
  return user;
}

export async function getWorkSpaces() {
  return await db.workspace.findMany({});
}

const generateCode = () => {
  const code = Array.from(
    { length: 6 },
    () => "0123456789abcdefjhijklmnopqrstuvwxyz"[Math.floor(Math.random() * 36)]
  ).join("");

  return code;
};
export async function addWorkSpace(name: string, userId: string) {
  if (!userId) return null;
  const { id: workspaceId } = await db.workspace.create({
    data: {
      name,
      userId,
      joinCode: generateCode(),
    },
  });

  await db.members.create({
    data: {
      role: "admin",
      userId,
      workspaceId,
    },
  });

  // at least one channel
  await db.channels.create({
    data: {
      name: "general",
      workspaceId,
    },
  });
}

export async function getAllWorkSpacesByUserId(userId: string) {
  if (!userId) {
    return null;
  }

  try {
    return await db.workspace.findMany({
      where: {
        Member: {
          some: {
            userId,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getWorkSpaceById(id: string) {
  if (!id) return null;
  return await db.workspace.findUnique({
    where: {
      id,
    },
  });
}

export async function getMemberByUserIdAndWorkSpaceId(
  userId: string,
  workspaceId: string
) {
  return await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
}

export async function updateWorkSpace(
  userId: string,
  workspaceId: string,
  data: tUpdatedWorkspace
) {
  if (!userId || !workspaceId) return null;
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
  const updatedWorkSpace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data,
  });
  return updatedWorkSpace;
}

export async function deleteWorkSpace(userId: string, workspaceId: string) {
  if (!userId || !workspaceId) return null;
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
  const deleteWorkSpace = await db.workspace.delete({
    where: {
      id: workspaceId,
    },
  });

  return deleteWorkSpace;
}
export async function generateNewJoinCode(userId: string, workspaceId: string) {
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
  const newJoinCode = generateCode();

  const updatedWorkspace = await db.workspace.update({
    where: {
      id: workspaceId,
    },
    data: {
      joinCode: newJoinCode,
    },
  });

  return updatedWorkspace;
}

export async function getWorkspaceNaiveInfo(
  userId: string,
  workspaceId: string
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
  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  return {
    workspaceName: workspace?.name,
    isMember: !!member,
  };
}

export async function makeUserJoin(
  userId: string,
  workspaceId: string,
  joinCode: string
) {
  if (!userId) {
    return null;
  }
  const workspace = await db.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (workspace?.joinCode !== joinCode.toLowerCase()) {
    return "join code mismatch";
  }
  const existingMembmer = await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
  if (existingMembmer) {
    return "Already a member of this workspace";
  }
  await db.members.create({
    data: {
      userId,
      workspaceId,
      role: "member",
    },
  });
  return workspace.id;
}

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

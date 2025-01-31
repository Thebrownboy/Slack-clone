import type { Message as tMessage } from "@prisma/client";
export type tMessagePlaceholder = tMessage;
export type tUser = {
  email: string | undefined;
  name: string | null | undefined;
  id: string | undefined;
  image: string | null | undefined;
};

export type tWorkspace = {
  joinCode: string;
  name: string;
  userId: string;
  id: string;
  createdAt: Date;
};

export type tUpdatedWorkspace = {
  joinCode?: string;
  name?: string;
  userId?: string;
  id?: string;
  createdAt?: Date;
};

export type tChannel = {
  id: string;
  name: string;
  workspaceId: string;
  creationTime: Date;
};

type tMember = {
  userId: string;
  workspaceId: string;
  role: "admin" | "member";
};

export type tWorkspaceMembers = {
  user: tUser;
  member: tMember;
};

export type tmember = {
  userId: string;
  workspaceId: string;
  role: "member" | "admin";
};

export type tFulldataMessage =
  | (tMessage & {
      URL: string | undefined;
      member: {
        workspaceId: string;
        role: "admin" | "member";
        userId: string;
      };
      user: {
        name: string | null;
        id: string;
        image: string | null;
        email: string;
      };
      reactions: {
        value: string;
        count: number;
        membersIds: string[];
      }[];
      threadCount: number;
      threadImage: string | null | undefined;
      threadTimestamp: number | Date;
    })
  | null;

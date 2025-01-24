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

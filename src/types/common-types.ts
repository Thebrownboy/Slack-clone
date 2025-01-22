export type tUser = {
  email: string;
  name: string | null;
  id: string;
  image: string | null;
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

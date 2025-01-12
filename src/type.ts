export type TMessage = {
  _id?: string;
  owner: string;
  content: string;
  conversation: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TConversation = {
  _id?: string;
  user: string;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TUser = {
  _id?: string;
  username: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export enum EChatMode {
  Normal = 0,
  Silent = 1,
  VR = 2,
}

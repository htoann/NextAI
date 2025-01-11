export type TMessage = {
  type: 'user' | 'ai';
  text: string;
};

export type TConversation = {
  user: string;
  title: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
};

export enum EChatMode {
  Normal = 0,
  Silent = 1,
  VR = 2,
}

export type Message = {
  type: 'user' | 'ai';
  text: string;
};

export enum ChatMode {
  Normal = 0,
  Silent = 1,
  VR = 2,
}

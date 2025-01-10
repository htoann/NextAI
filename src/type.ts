export type TMessage = {
  type: 'user' | 'ai';
  text: string;
};

export enum EChatMode {
  Normal = 0,
  Silent = 1,
  VR = 2,
}

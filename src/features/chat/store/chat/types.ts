import { IMessage } from '@src/features/chat/ws/types';

export type TMessageStatus = 'sent' | 'delivered' | 'read';

export type TMethod = 'auth' | 'last' | 'post' | 'old' | 'clear';

export interface IListenerHandlers {
  authorize: () => void;
  addMessage: (message: IMessage, status?: TMessageStatus) => void;
  addMessages: (messages: IMessage[], clear?: boolean) => void;
  changeMessageStatus: (id: string, status: TMessageStatus) => void;
  clearMessages: () => void;
}

export interface IChatMessage extends IMessage {
  status: TMessageStatus;
}

export interface IChatState {
  messages: IChatMessage[];
}

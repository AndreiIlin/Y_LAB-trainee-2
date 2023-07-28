import { IListenerHandlers, TMethod } from '@src/features/chat/store/chat/types';
import { TChatEventData } from '@src/features/chat/ws/types';
import { TServices } from '@src/services/types';
import Socket from '@src/services/ws/socket';
import { IDefaultWSConfig, TSocketsNames } from '@src/services/ws/types';

class ChatSocket extends Socket {
  private _messagesKeys: string[];

  constructor(config: IDefaultWSConfig, services: TServices, name: TSocketsNames) {
    super(config, services, name);
    this._messagesKeys = [];
  }

  listen(handlers: IListenerHandlers) {
    if (!this.socket) return;
    this.socket.onmessage = (ev: MessageEvent<string>) => {
      const eventData: TChatEventData = JSON.parse(ev.data);

      switch (eventData.method) {
        case 'auth':
          if (!eventData.payload.result) return;
          handlers.authorize();
          break;
        case 'last':
          if (!eventData.payload.items.length) return;
          handlers.addMessages(eventData.payload.items, true);
          break;
        case 'post':
          const key = eventData.payload._key;
          if (!this._messagesKeys.includes(key)) {
            handlers.addMessage(eventData.payload);
            return;
          }
          handlers.changeMessageStatus(key, 'delivered');
          this._messagesKeys = this._messagesKeys.filter(k => k !== key);
          break;
        case 'clear':
          handlers.clearMessages();
          break;
        case 'old':
          handlers.addMessages(eventData.payload.items);
          break;
        default:
          break;
      }
    };
  }

  auth(token: string) {
    if (!this.socket) return;
    this.socket.onopen = function () {
      if (this.readyState !== 1) return;
      console.log('Chat socket connection opened');
      this.send(JSON.stringify({
        method: 'auth',
        payload: {
          token: token,
        },
      }));
    };
  }

  setKey(key: string) {
    this._messagesKeys.push(key);
  }

  sendMessage<T>(method: TMethod, payload: T) {
    if (!this.socket || this.socket.readyState !== 1) return;
    this.socket.send(JSON.stringify({
      method,
      payload,
    }));
  }

  getRecentMessages() {
    if (!this.socket || this.socket.readyState !== 1) return;
    this.sendMessage('last', {});
  }

  close() {
    if (!this.socket) return;
    this.socket.close();
    console.log('Chat socket connection closed');
  }
}

export default ChatSocket;

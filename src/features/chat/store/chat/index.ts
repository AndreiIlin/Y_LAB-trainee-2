import { IChatMessage, IChatState, TMessageStatus } from '@src/features/chat/store/chat/types';
import { IMessage } from '@src/features/chat/ws/types';
import StoreModule from '@src/services/store/module';

class ChatState extends StoreModule<undefined> {

  defaultState(): IChatState {
    return {
      messages: [],
    };
  }

  addMessages(messages: IMessage[], clear = false) {
    const newMessages: IChatMessage[] = messages.map(message => ({ ...message, status: 'delivered' } as IChatMessage))
      .filter(message => clear ? message : message._id !== this.getState().messages[0]._id);

    if (clear) {
      this.setState({
        ...this.getState(),
        messages: newMessages,
      }, 'Добавлены новые сообщения');
      return;
    }

    this.setState({
      ...this.getState(),
      messages: [...newMessages, ...this.getState().messages],
    }, 'Добавлены новые сообщения');
  }

  addMessage(message: IMessage, status: TMessageStatus = 'delivered') {
    this.setState({
      ...this.getState(),
      messages: [...this.getState().messages, { ...message, status }],
    }, 'Добавлено новое сообщение');
  }

  changeMessageStatus(key: string, status: TMessageStatus) {
    this.setState({
      ...this.getState(),
      messages: this.getState().messages.map((message: IChatMessage) => message._key !== key ? message : {
        ...message,
        status,
      }),
    }, 'Статус сообщения изменен');
  }

  clearMessages() {
    this.setState({
      ...this.getState(),
      messages: [],
    }, 'Сообщения удалены');
  }
}

export default ChatState;

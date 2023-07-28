import { cn as bem } from '@bem-react/classname';
import ChatControls from '@src/features/chat/components/chat-controls';
import ChatMessage from '@src/features/chat/components/chat-message';
import { IListenerHandlers, TMessageStatus } from '@src/features/chat/store/chat/types';
import { IMessage } from '@src/features/chat/ws/types';
import { useTranslate } from '@src/services/i18n/use-i18n';
import useSelector from '@src/services/store/use-selector';
import useServices from '@src/services/use-services';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import './style.less';

const INIT_MESSAGES_LENGTH = 10;
const MESSAGES_GAP = 10;

function ChatBoard() {
  const cn = bem('ChatBoard');
  const ws = useServices().ws;
  const store = useServices().store;

  const t = useTranslate();

  const chatWs = ws.sockets.chat;

  const userData = useSelector(state => ({
    token: state.session.token,
    user: state.session.user,
  }));

  const chatData = useSelector(state => ({
    messages: state.chat.messages,
  }));

  const messageBoardRef = useRef<HTMLDivElement>(null);

  const [isAuthorized, setIsAuthorized] = useState(false);

  const callbacks = {
    handleAuthorize: useCallback(() => {
      setIsAuthorized(true);
    }, []),
    addMessage: useCallback((message: IMessage, status: TMessageStatus = 'delivered') => {
      store.modules.chat.addMessage(message, status);
    }, []),
    addMessages: useCallback((messages: IMessage[], clear = false) => {
      store.modules.chat.addMessages(messages, clear);
    }, []),
    changeMessageStatus: useCallback((id: string, status: TMessageStatus) => {
      store.modules.chat.changeMessageStatus(id, status);
    }, []),
    clearMessages: useCallback(() => {
      store.modules.chat.clearMessages();
    }, []),
    sendMessage: useCallback((text: string) => {
      const key = uuid();
      chatWs.setKey(key);

      const newMessage: IMessage = {
        _id: key,
        _key: key,
        text,
        dateCreate: new Date(Date.now()).toISOString(),
        author: {
          id: userData.user!._id,
          username: userData.user!.username,
          profile: {
            name: userData.user!.profile.name,
            avatar: {},
          },
        },
      };

      store.modules.chat.addMessage(newMessage, 'sent');

      chatWs.sendMessage('post', {
        _key: key,
        text,
      });
    }, []),
  };

  const wsHandlers: IListenerHandlers = useMemo(() => ({
    authorize: callbacks.handleAuthorize,
    addMessage: callbacks.addMessage,
    addMessages: callbacks.addMessages,
    changeMessageStatus: callbacks.changeMessageStatus,
    clearMessages: callbacks.clearMessages,
  }), []);

  const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting && messageBoardRef.current &&
      messageBoardRef.current.firstElementChild && entries[0].target === messageBoardRef.current.firstElementChild) {
      chatWs.sendMessage('old', {
        fromId: chatData.messages[0]._id,
      });
      messageBoardRef.current.scrollTo({
        behavior: 'smooth',
        top: messageBoardRef.current.scrollHeight / (chatData.messages.length / 10),
      });
      observer.unobserve(entries[0].target);
    }
  }, {
    threshold: 1,
  });

  useEffect(() => {
    if (!userData.token) return;
    chatWs.init();
    chatWs.listen(wsHandlers);
    chatWs.auth(userData.token);

    return () => chatWs.close();
  }, [userData.token]);

  useEffect(() => {
    if (!isAuthorized) return;
    chatWs.getRecentMessages();
  }, [isAuthorized]);


  useEffect(() => {
    if (!messageBoardRef.current || !chatData.messages.length) return;

    if (chatData.messages.length <= INIT_MESSAGES_LENGTH || messageBoardRef.current.scrollTop === messageBoardRef.current.scrollHeight - messageBoardRef.current.clientHeight - messageBoardRef.current.lastElementChild!.scrollHeight - MESSAGES_GAP) {
      messageBoardRef.current?.scrollTo({
        behavior: 'smooth',
        top: messageBoardRef.current.scrollHeight,
      });
    }

    setTimeout(() => {
      if (!messageBoardRef.current || !messageBoardRef.current.firstElementChild) return;
      observer.observe(messageBoardRef.current.firstElementChild);
    }, 100);
  }, [chatData.messages]);

  return (
    <div className={cn()}>
      <div className={cn('board')} ref={messageBoardRef}>
        {chatData.messages.map(message => {
          const isOwn = userData.user?.profile.name === message.author.profile.name;
          return (
            <ChatMessage
              key={message._id}
              text={message.text}
              author={message.author.profile.name}
              isOwn={isOwn}
              status={message.status}
              date={message.dateCreate}
              t={t}
            />
          );
        })}
      </div>
      <ChatControls t={t} sendMessage={callbacks.sendMessage} />
    </div>
  );
}

export default memo(ChatBoard);

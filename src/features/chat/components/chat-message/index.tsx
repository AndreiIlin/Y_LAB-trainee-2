import { cn as bem } from '@bem-react/classname';
import { TMessageStatus } from '@src/features/chat/store/chat/types';
import { TTranslateFn } from '@src/services/i18n/types';
import { memo } from 'react';
import './style.less';

interface ChatMessageProps {
  text: string;
  author: string;
  isOwn: boolean;
  status: TMessageStatus;
  date: string;
  t: TTranslateFn;
}

function ChatMessage({ text, author, isOwn, date, status, t }: ChatMessageProps) {
  const cn = bem('ChatMessage');

  const formattedDate = new Intl.DateTimeFormat('ru', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(date));

  return (
    <div className={cn({ own: isOwn })}>
      <div className={cn('meta')}>
        <p className={cn('meta-title')}>
          {t('chat.message.created')}: <span className={cn('meta-description')}>{formattedDate}</span>
        </p>
        <p className={cn('meta-title')}>
          {t('chat.message.author')}: <span className={cn('meta-description')}>{author}</span>
        </p>
        {isOwn && (
          <p className={cn('meta-title')}>
            {t('chat.message.status')}: <span className={cn('meta-description', { status })}>
              {t(`chat.message.statuses.${status}`)}
            </span>
          </p>
        )}
      </div>
      <div className={cn('text')}>
        {text}
      </div>
    </div>
  );
}

export default memo(ChatMessage);

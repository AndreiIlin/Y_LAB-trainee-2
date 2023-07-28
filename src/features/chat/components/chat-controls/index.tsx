import { cn as bem } from '@bem-react/classname';
import { TTranslateFn } from '@src/services/i18n/types';
import { ChangeEvent, FormEvent, memo, useEffect, useRef, useState } from 'react';
import './styles.less';

interface ChatControlsProps {
  t: TTranslateFn;
  sendMessage: (text: string) => void;
}

function ChatControls({ sendMessage, t }: ChatControlsProps) {
  const cn = bem('ChatControls');

  const [value, setValue] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) return;
    sendMessage(value);
    setValue('');
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <form className={cn()} onSubmit={handleSubmit}>
      <input
        className={cn('text-field')}
        type="text"
        value={value}
        onChange={handleChange}
        ref={inputRef}
      />
      <button type="submit" className={cn('controller')}>{t('chat.send')}</button>
    </form>
  );
}

export default memo(ChatControls);

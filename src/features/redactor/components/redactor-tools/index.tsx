import { TFiguresNames } from '@src/services/canvas/types';
import { TTranslateFn } from '@src/services/i18n/types';
import { memo, MouseEvent } from 'react';
import './style.less';

interface RedactorToolsProps {
  addDraw: (name: TFiguresNames) => void;
  clear: () => void;
  animate: () => void;
  leafFall: () => void;
  t: TTranslateFn;
}

function RedactorTools({ addDraw, clear, animate, leafFall, t }: RedactorToolsProps) {

  const handleDraw = (event: MouseEvent<HTMLButtonElement>) => {
    addDraw(event.currentTarget.name as TFiguresNames);
  };

  return (
    <div className={'RedactorTools'}>
      <button onClick={handleDraw} name="circle" className={'RedactorTools-tool'}>{t('redactor.circle')}</button>
      <button onClick={handleDraw} name="square" className={'RedactorTools-tool'}>{t('redactor.square')}</button>
      <button onClick={handleDraw} name="rectangle" className={'RedactorTools-tool'}>{t('redactor.rectangle')}</button>
      <button onClick={handleDraw} name="triangle" className={'RedactorTools-tool'}>{t('redactor.triangle')}</button>
      <button onClick={handleDraw} name="leaf" className={'RedactorTools-tool'}>{t('redactor.leaf')}</button>
      <button onClick={animate} className={'RedactorTools-tool'}>{t('redactor.animation')}</button>
      <button onClick={leafFall} className={'RedactorTools-tool'}>{t('redactor.leafFall')}</button>
      <button onClick={clear} className={'RedactorTools-tool'}>{t('redactor.clear')}</button>
    </div>
  );
}

export default memo(RedactorTools);

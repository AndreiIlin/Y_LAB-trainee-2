import RedactorScreen from '@src/features/redactor/components/redactor-screen';
import RedactorTools from '@src/features/redactor/components/redactor-tools';
import { TFiguresNames } from '@src/services/canvas/types';
import useI18n from '@src/services/i18n/use-i18n';
import useServices from '@src/services/use-services';
import { memo, useCallback, useEffect, useRef } from 'react';

function RedactorBoard() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const services = useServices();
  const { t } = useI18n();

  const callbacks = {
    draw: useCallback((name: TFiguresNames) => {
      services.canvas.addDraw(name);
    }, []),
    clear: useCallback(() => {
      services.canvas.clear();
    }, []),
    animate: useCallback(() => {
      services.canvas.animate();
    }, []),
    leafFall: useCallback(() => {
      services.canvas.leafFall();
    }, []),
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    services.canvas.init(canvasRef.current);

    return () => services.canvas.unmount();
  }, []);

  return (
    <>
      <RedactorTools
        clear={callbacks.clear}
        addDraw={callbacks.draw}
        animate={callbacks.animate}
        leafFall={callbacks.leafFall}
        t={t}
      />
      <RedactorScreen canvasRef={canvasRef} />
    </>
  );
}

export default memo(RedactorBoard);

import { memo, RefObject } from 'react';
import './style.less';

interface RedactorScreenProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

function RedactorScreen({
                          canvasRef,
                        }: RedactorScreenProps) {


  return <canvas
    className={'RedactorScreen'}
    ref={canvasRef}
  />;
}

export default memo(RedactorScreen);

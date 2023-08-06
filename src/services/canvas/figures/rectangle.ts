import Figure from '@src/services/canvas/figure';
import { IFigureParams, TFiguresNames } from '@src/services/canvas/types';

class Rectangle extends Figure {
  type: TFiguresNames = 'rectangle';

  constructor(canvas: HTMLCanvasElement, params: IFigureParams) {
    super(canvas, params);
    this.x1 = this.coordinates.x1;
    this.y1 = this.coordinates.y1;
    this.x2 = this.coordinates.x2;
    this.y2 = this.coordinates.y1 + ((this.coordinates.y2 - this.coordinates.y1) / 2);
  }
}

export default Rectangle;

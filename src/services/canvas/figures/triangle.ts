import Figure from '@src/services/canvas/figure';
import { IFigureParams, TFiguresNames } from '@src/services/canvas/types';

class Triangle extends Figure {
  type: TFiguresNames = 'triangle';

  constructor(canvas: HTMLCanvasElement, params: IFigureParams) {
    super(canvas, params);
    this.x1 = this.coordinates.x1;
    this.y1 = this.coordinates.y1;
    this.x2 = this.coordinates.x2;
    this.y2 = this.coordinates.y2;
  }

  override draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x1, this.y1);
    this.ctx.lineTo(this.x2, this.y1 + ((this.y2 - this.y1) / 2));
    this.ctx.lineTo(this.x1, this.y2);
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export default Triangle;

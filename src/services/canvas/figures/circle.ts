import Figure from '@src/services/canvas/figure';
import { IFigureParams, TFiguresNames } from '@src/services/canvas/types';

class Circle extends Figure {
  type: TFiguresNames = 'circle';
  private startAngle = 0;
  private endAngle = 2 * Math.PI;
  private _radius = 0;

  constructor(canvas: HTMLCanvasElement, params: IFigureParams) {
    super(canvas, params);
    this._radius = (this.coordinates.x2 - this.coordinates.x1) / 2;
    this.x1 = this.coordinates.x1;
    this.y1 = this.coordinates.y1;
    this.x2 = this.coordinates.x2;
    this.y2 = this.coordinates.y2;
  }

  override draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.x2 - this._radius, this.y2 - this._radius, this._radius, this.startAngle, this.endAngle);
    this.ctx.fill();
    this.ctx.closePath();
  }
}

export default Circle;

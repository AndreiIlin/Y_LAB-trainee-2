import { ICoordinates, IFigureParams } from '@src/services/canvas/types';

class Figure {
  private _canvas: HTMLCanvasElement;
  private _ctx: CanvasRenderingContext2D | null;
  private _color = this.getRandomColor();
  private _width = 0;
  private _height = 0;
  private _figureSize = 60;
  private _coordinates: ICoordinates = { x1: 0, y1: 0, y2: 0, x2: 0 };
  private _animationStep = 3;
  private _params: IFigureParams;
  x1 = 0;
  x2 = 0;
  y1 = 0;
  y2 = 0;

  constructor(canvas: HTMLCanvasElement, params: IFigureParams) {
    this._canvas = canvas;
    this._params = params;
    this._ctx = canvas.getContext('2d');
    this._width = canvas.width;
    this._height = canvas.height;
    this._coordinates = this.getRandomCoordinates();
  }

  updateParams(params: IFigureParams) {
    this._params = params;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get params() {
    return this._params;
  }

  get coordinates() {
    return this._coordinates;
  }

  get ctx() {
    return this._ctx;
  }

  get color() {
    return this._color;
  }

  isIntersect({ x, y }: { x: number, y: number }) {
    return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
  }

  animate = () => {
    if (this.y2 >= (this._height + this._params.scrollY) / this._params.scale) return;

    this.y1 += this._animationStep;
    this.y2 += this._animationStep;

    requestAnimationFrame(this.animate);
  };

  draw() {
    if (!this.ctx) return;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
    this.ctx.closePath();
  }

  getRandomCoordinates(): ICoordinates {
    const x = (Math.floor(Math.random() * this._width) + this._params.scrollX) / this._params.scale;
    const y = (Math.floor(Math.random() * this._height) + this._params.scrollY) / this._params.scale;
    const dx = x + this._figureSize >= this._width ? x - this._figureSize
      : x - this._figureSize < 0 ? x + this._figureSize : x;
    const dy = y + this._figureSize >= this._height ? y - this._figureSize
      : y - this._figureSize < 0 ? y + this._figureSize : y;

    return { x1: dx, y1: dy, x2: dx + this._figureSize, y2: dy + this._figureSize };
  }

  getRandomColor() {
    return `rgb(
        ${Math.floor(Math.floor(Math.random() * 256))},
        ${Math.floor(Math.floor(Math.random() * 256))},
        0)`;
  }
}

export default Figure;

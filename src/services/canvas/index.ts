import { IFigureParams, TCanvasActions, TFiguresInstances, TFiguresNames } from '@src/services/canvas/types';
import Service from '@src/services/service';
import * as figures from './imports';

class CanvasService extends Service {
  private _canvas: HTMLCanvasElement | null = null;
  private _figures: TFiguresInstances<TFiguresNames>[] = [] as unknown as TFiguresInstances<TFiguresNames>[];
  private _ctx: CanvasRenderingContext2D | null = null;
  private _width = 0;
  private _height = 0;
  private _action: TCanvasActions | null = null;
  private _scrollX = 0;
  private _scrollY = 0;
  private _clientX = 0;
  private _clientY = 0;
  private _scale = 1;
  private _cycledAnimation = false;

  override init(canvas: HTMLCanvasElement) {
    if (!canvas) return;
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    this._clientX = rect.x;
    this._clientY = rect.y;
    this._canvas.width = 800;
    this._canvas.height = 400;
    this._width = this._canvas.width;
    this._height = this._canvas.height;
    this._canvas.addEventListener('mousedown', this.mouseDown);
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
    this._canvas.addEventListener('wheel', this.mouseWheel);

    this.draw();
  }

  addDraw(name: TFiguresNames) {
    const params: IFigureParams = {
      scrollX: this._scrollX,
      scrollY: this._scrollY,
      scale: this._scale,
    };
    this._figures.push(new figures[name](this._canvas as HTMLCanvasElement, params));
  }

  draw = () => {
    if (!this._ctx) return;
    this._ctx.save();
    this.clearRect();
    this._ctx.translate(-this._scrollX, -this._scrollY);
    this._ctx.scale(this._scale, this._scale);
    this._figures.forEach(figure => {
      figure.updateParams({
        scrollX: this._scrollX,
        scrollY: this._scrollY,
        scale: this._scale,
      });
      figure.draw();
    });
    this._ctx.restore();
    requestAnimationFrame(this.draw);
  };

  clearRect() {
    this._ctx?.clearRect(0, 0, this._width, this._height);
  }

  clear() {
    this._ctx?.clearRect(0, 0, this._width, this._height);
    this._figures = [];
  }

  animate() {
    this._figures.forEach(figure => figure.animate());
  }

  mouseWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY > 0 ? 0.1 : -0.1;

    if (event.ctrlKey) {
      const cursorX = event.clientX - this._clientX;
      const cursorY = event.clientY - this._clientY;

      this.zoom(delta, cursorX, cursorY);
    }
  };

  mouseUp = (event: MouseEvent) => {
    if (!this._action) return;
    this._action = null;
  };

  mouseDown = (event: MouseEvent) => {
    const cursorX = event.clientX - this._clientX;
    const cursorY = event.clientY - this._clientY;
    const intersectedFigure = this._figures.find(figure => figure.isIntersect({
      x: (cursorX + this._scrollX) / this._scale, y: (cursorY + this._scrollY) / this._scale,
    }));

    if (!intersectedFigure) {
      this._action = {
        name: 'scroll',
        cursorX,
        cursorY,
        startX: this._scrollX,
        startY: this._scrollY,
      };
      return;
    }

    this._action = {
      name: 'drag',
      cursorX,
      cursorY,
      intersectedFigure,
      figureStartX1: intersectedFigure.x1,
      figureStartX2: intersectedFigure.x2,
      figureStartY1: intersectedFigure.y1,
      figureStartY2: intersectedFigure.y2,
    };
  };

  mouseMove = (event: MouseEvent) => {
    if (!this._action) return;

    if (this._action.name === 'scroll') {
      const dx = (event.clientX - this._clientX - this._action.cursorX);
      const dy = (event.clientY - this._clientY - this._action.cursorY);

      this.scroll({ x: this._action.startX - dx, y: this._action.startY - dy });
    }

    if (this._action.name === 'drag') {
      const dx = (event.clientX - this._clientX - this._action.cursorX) / this._scale;
      const dy = (event.clientY - this._clientY - this._action.cursorY) / this._scale;

      this._action.intersectedFigure.x1 = this._action.figureStartX1 + dx;
      this._action.intersectedFigure.x2 = this._action.figureStartX2 + dx;
      this._action.intersectedFigure.y1 = this._action.figureStartY1 + dy;
      this._action.intersectedFigure.y2 = this._action.figureStartY2 + dy;
    }
  };

  scroll({ x, y }: { x: number, y: number }) {
    this._scrollY = y;
    this._scrollX = x;
  }

  zoom(delta: number, x: number, y: number) {

    const realX = (x + this._scrollX) / this._scale;
    const realY = (y + this._scrollY) / this._scale;

    this._scale += this._scale * delta;
    this._scale = Math.max(0.1, this._scale);


    const newX = realX * this._scale;
    const newY = realY * this._scale;

    this.scroll({ x: newX - x, y: newY - y });
  }

  leafFall() {
    this._cycledAnimation = !this._cycledAnimation;

    if (!this._cycledAnimation) return;

    const interval = setInterval(() => {
      if (!this._cycledAnimation) {
        clearInterval(interval);
        return;
      }

      const params: IFigureParams = {
        scrollX: this._scrollX,
        scrollY: this._scrollY,
        scale: this._scale,
        startY: 0,
      };

      const leaf = new figures['leaf'](this._canvas as HTMLCanvasElement, params);
      this._figures.push(leaf);
      leaf.leafFall();
    }, 500);

  }

  unmount() {
    if (!this._canvas) return;
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
    this._canvas.removeEventListener('mousedown', this.mouseDown);
    this._canvas.removeEventListener('wheel', this.mouseWheel);
    this._canvas = null;
    this._ctx = null;
    this._width = 0;
    this._height = 0;
    this._figures = [];
    this._action = null;
    this._scrollX = 0;
    this._scrollY = 0;
    this._scale = 1;
  }

}

export default CanvasService;

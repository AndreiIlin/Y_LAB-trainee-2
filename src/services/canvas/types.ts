import * as figures from './imports';

export type TFigures = typeof figures;

export type TFiguresNames = keyof TFigures;

export type TFiguresInstances<Key extends TFiguresNames> = InstanceType<TFigures[Key]>;

interface IScrollAction {
  name: 'scroll';
  startX: number;
  startY: number;
  cursorX: number;
  cursorY: number;
}

interface IDragAction {
  name: 'drag';
  cursorX: number;
  cursorY: number;
  figureStartX1: number;
  figureStartX2: number;
  figureStartY1: number;
  figureStartY2: number;
  intersectedFigure:  TFiguresInstances<TFiguresNames>
}

export type TCanvasActions = IScrollAction | IDragAction;

export interface ICoordinates {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface IFigureParams {
  scale: number;
  scrollX: number;
  scrollY: number;
  startY?: number
}



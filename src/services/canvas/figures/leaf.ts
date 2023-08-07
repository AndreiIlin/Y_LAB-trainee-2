import Figure from '@src/services/canvas/figure';
import { IFigureParams, TFiguresNames } from '@src/services/canvas/types';
import leaf1 from '../assets/leave01.png';
import leaf2 from '../assets/leave02.png';
import leaf3 from '../assets/leave03.png';
import leaf4 from '../assets/leave04.png';
import leaf5 from '../assets/leave05.png';

class Leaf extends Figure {
  type: TFiguresNames = 'leaf';
  leaves = [leaf1, leaf2, leaf3, leaf4, leaf5];
  leaf = '';
  image: HTMLImageElement | null = null;
  OriginalImageWidth = 0;
  OriginalImageHeight = 0;
  imageRatio = 0;
  imageWidth = 0;
  imageHeight = 0;
  startPoint = 0;
  direction: 'left' | 'right' = 'left';
  angle = 0;
  shift = 0;
  shiftSpeed = 0.5;
  fallingSpeed = 0.5;
  rotationSpeed = 0.5;
  minAngle = -45;
  maxAngle = 45;

  constructor(canvas: HTMLCanvasElement, params: IFigureParams) {
    super(canvas, params);
    this.x1 = this.coordinates.x1;
    this.y1 = typeof this.params.startY !== 'undefined' ? this.startPoint : this.coordinates.y1;
    this.x2 = this.coordinates.x2;
    this.y2 = typeof this.params.startY !== 'undefined' ? this.startPoint + (this.coordinates.y2 - this.coordinates.y1) : this.coordinates.y2;
    this.leaf = this.leaves[Math.floor(Math.random() * this.leaves.length)];
    this.image = new Image();
    this.image.src = this.leaf;
  }

  override draw() {
    if (!this.ctx || !this.image) return;

    if (!this.OriginalImageWidth || !this.OriginalImageHeight) {
      this.OriginalImageWidth = this.image.width;
      this.OriginalImageHeight = this.image.height;
      this.imageRatio = this.image.width / this.image.height;
      this.imageWidth = this.x2 - this.x1;
      this.imageHeight = this.imageWidth / this.imageRatio;

      if (this.imageHeight > this.y2 - this.y1) {
        this.imageHeight = this.y2 - this.y1;
        this.imageWidth = (this.y2 - this.y1) * this.imageRatio;
      }
    }

    const centerX = (this.x2 + this.x1) /2;
    const centerY = (this.y2 + this.y1) / 2;
    const rotation = this.angle * (Math.PI / 180);

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.rotate(rotation);
    this.ctx.drawImage(this.image, -this.imageWidth, -this.imageHeight, this.imageWidth, this.imageHeight);
    this.ctx.restore();
  }

  leafFall = () => {
    if (Math.min(this.y2, this.y1) >= (this.height + this.params.scrollY) / this.params.scale) return;

    this.y1 += this.fallingSpeed;
    this.y2 += this.fallingSpeed;

    const width = (this.width + this.params.scrollX) / this.params.scale;

    if (this.direction === 'left') {
      if (this.x1 >= 0 && this.shift >= -width / 10) {
        this.x1 -= this.shiftSpeed;
        this.x2 -= this.shiftSpeed;
        this.shift -= this.shiftSpeed;

        if (this.angle <= this.maxAngle) {
          this.angle += this.rotationSpeed;
        }

      } else {
        this.direction = 'right';
      }
    } else {
      if (this.x2 <= width && this.shift <= width / 10) {
        this.x1 += this.shiftSpeed;
        this.x2 += this.shiftSpeed;
        this.shift += this.shiftSpeed;

        if (this.angle >= this.minAngle) {
          this.angle -= this.rotationSpeed;
        }

      } else {
        this.direction = 'left';
      }
    }

    requestAnimationFrame(this.leafFall);
  };
}

export default Leaf;

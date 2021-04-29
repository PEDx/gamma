import { DIRECTIONS } from '@/utils';
import { Movable, IMovable } from '@/class/Movable';

interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

const MIN_SIZE = 10;

export class Editable {
  element: HTMLElement;
  distance: number;
  movable: Movable;
  container: HTMLElement;
  private effect?: (arg: IRect) => void;
  private isEditing: boolean;
  private leftEdge: number = 0;
  private rightEdge: number = 0;
  private topEdge: number = 0;
  private bottomEdge: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private clientX: number = 0;
  private clientY: number = 0;
  private height: number = 0;
  private width: number = 0;
  private direction: DIRECTIONS = DIRECTIONS.NULL;
  offsetRight: number = 0;
  offsetBottom: number = 0;
  constructor({ element, distance, container, effect }: IMovable) {
    this.element = element;
    this.distance = distance;
    this.container = container;
    this.movable = new Movable({
      element: element,
      container: container,
      distance: 10,
    });
    this.effect = effect;
    this.isEditing = false;
    this.init();
  }
  private init() {
    this.element.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.mousemoveHandler(e));
    document.addEventListener('mouseup', (e) => this.mouseupHandler(e));
  }
  private handleMouseDown(e: MouseEvent) {
    const element = this.element;
    this.isEditing = true;
    this.leftEdge = this.container.offsetLeft || 0;
    this.rightEdge = this.container.clientWidth || 0;
    this.topEdge = this.container.offsetTop || 0;
    this.bottomEdge = this.container.clientHeight || 0;
    //获取元素距离定位父级的x轴及y轴距离
    this.offsetX = this.movable.getPostion().x;
    this.offsetY = this.movable.getPostion().y;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    //获取此时元素的宽高
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;

    this.offsetRight = this.offsetX + this.width;
    this.offsetBottom = this.offsetY + this.height;
  }
  private mousemoveHandler(e: MouseEvent) {
    if (this.direction === DIRECTIONS.NULL) return;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    const clientX2 = e.clientX;
    const clientY2 = e.clientY;
    const {
      offsetX,
      offsetY,
      clientX,
      clientY,
      width,
      height,
      leftEdge,
      rightEdge,
      topEdge,
      bottomEdge,
      distance,
    } = this;

    let editWidth = width;
    let editHeight = height;
    let editTop = offsetY;
    let editLeft = offsetX;

    if (this.direction & DIRECTIONS.L) {
      editWidth = width + (clientX - clientX2);
      editLeft = offsetX + (clientX2 - clientX);
    }

    if (this.direction & DIRECTIONS.R) {
      editWidth = width + (clientX2 - clientX);
    }

    if (this.direction & DIRECTIONS.T) {
      editTop = offsetY + (clientY2 - clientY);
      editHeight = height + (clientY - clientY2);
    }

    if (this.direction & DIRECTIONS.B) {
      editHeight = height + (clientY2 - clientY);
    }

    // 尺寸限定
    if (editWidth < MIN_SIZE) {
      editWidth = MIN_SIZE;
      editLeft = this.offsetRight - MIN_SIZE;
    }
    if (this.direction & DIRECTIONS.R) {
      editLeft = offsetX;
    }
    if (editHeight < MIN_SIZE) {
      editHeight = MIN_SIZE;
      editTop = this.offsetBottom - MIN_SIZE;
    }
    if (this.direction & DIRECTIONS.B) {
      editTop = offsetY;
    }

    //范围限定
    // 限制右边界 吸附
    if (
      editWidth + editLeft > rightEdge - distance &&
      !(this.direction & DIRECTIONS.L)
    ) {
      editWidth = rightEdge - offsetX;
    }
    // 限制下边界 吸附
    if (
      editHeight + editTop > bottomEdge - distance &&
      !(this.direction & DIRECTIONS.T)
    ) {
      editHeight = bottomEdge - offsetY;
    }
    // 限制左边界 吸附
    if (editLeft < leftEdge + distance && !(this.direction & DIRECTIONS.R)) {
      editLeft = leftEdge;
      editWidth = width + offsetX;
    }
    // 限制上边界 吸附
    if (editTop < topEdge + distance && !(this.direction & DIRECTIONS.B)) {
      editTop = topEdge;
      editHeight = height + offsetY;
    }

    if (this.direction & (DIRECTIONS.L | DIRECTIONS.R)) {
      this.updateElementStyle('width', `${editWidth}px`);
    }
    if (this.direction & (DIRECTIONS.T | DIRECTIONS.B)) {
      this.updateElementStyle('height', `${editHeight}px`);
    }
    if (this.direction & (DIRECTIONS.T | DIRECTIONS.L)) {
      this.movable.updateElementStyle({
        x: editLeft,
        y: editTop,
      });
    }
  }
  private mouseupHandler(e: MouseEvent) {
    if (this.isEditing && this.effect)
      this.effect({
        x: this.movable.getPostion().x,
        y: this.movable.getPostion().y,
        width: this.element.clientWidth,
        height: this.element.clientHeight,
      });
    this.isEditing = false;
    this.setDirection(DIRECTIONS.NULL);
  }
  private updateElementStyle(key: string, value: string) {
    const element = this.element;
    element.style.setProperty(key, value);
  }
  setDirection(direction: DIRECTIONS) {
    this.movable.block();
    this.direction = direction;
  }
  destory() {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
  }
}

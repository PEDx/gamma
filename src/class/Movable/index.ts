interface IPosition {
  x: number;
  y: number;
}

export interface IMovable {
  element: HTMLElement; // 移动的元素
  container: HTMLElement; // 相对于移动的父容器
  distance: number; // 容器吸附距离
  effect?: (arg: IPosition) => void;
}

export class Movable {
  element: HTMLElement;
  distance: number;
  container: HTMLElement;
  private effect?: (arg: IPosition) => void;
  private isMoving: boolean;
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
  private movePosition: IPosition;
  offsetParent: Element | null;
  overtop: boolean;
  constructor({ element, distance, container, effect }: IMovable) {
    this.element = element;
    this.offsetParent = element.offsetParent; // 实际布局的相对的容器
    this.distance = distance;
    this.container = container; // 设置得相对的容器
    this.effect = effect;
    this.isMoving = false;
    this.movePosition = { x: 0, y: 0 };
    this.overtop = false;
    this.init();
  }
  private init() {
    if (this.offsetParent !== this.container) {
      this.overtop = true;
      this.leftEdge = this.container.offsetLeft || 0;
      this.topEdge = this.container.offsetTop || 0;
      this.updateElementStyle({
        x: this.leftEdge,
        y: this.topEdge,
      });
    }
    this.element.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    document.addEventListener('mousemove', (e) => this.mousemoveHandler(e));
    document.addEventListener('mouseup', (e) => this.mouseupHandler(e));
  }
  private handleMouseDown(e: MouseEvent) {
    const element = this.element;
    this.isMoving = true;
    this.leftEdge = this.container.offsetLeft || 0;
    this.rightEdge = this.leftEdge + this.container.clientWidth || 0;
    this.topEdge = this.container.offsetTop || 0;
    this.bottomEdge = this.topEdge + this.container.clientHeight || 0;
    //获取元素距离定位父级的x轴及y轴距离
    this.offsetX = this.leftEdge + this.movePosition.x;
    this.offsetY = this.topEdge + this.movePosition.y;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    this.clientX = this.leftEdge + e.clientX;
    this.clientY = this.topEdge + e.clientY;
    //获取此时元素的宽高
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
  }
  private mousemoveHandler(e: MouseEvent) {
    if (!this.isMoving) return;
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
    //计算此时元素应该距离视口左上角的x轴及y轴距离
    let x = offsetX + (clientX2 - clientX);
    let y = offsetY + (clientY2 - clientY);
    //获取鼠标移动时元素四边的瞬时值
    const L = x;
    const R = x + width;
    const T = y;
    const B = y + height;
    //在将X和Y赋值给left和top之前，进行范围限定。只有在范围内时，才进行相应的移动
    // 如果到达左侧的吸附范围，则left置L0
    if (L - leftEdge < distance) {
      x = leftEdge;
    }
    //如果到达右侧的吸附范围，则left置为R0
    if (rightEdge - R < distance) {
      x = rightEdge - width;
    }

    //如果到达上侧的吸附范围，则top置T0
    if (T - topEdge < distance) {
      y = topEdge;
    }
    //如果到达右侧的吸附范围，则top置为B0
    if (bottomEdge - B < distance) {
      y = bottomEdge - height;
    }

    this.updateElementStyle({
      x,
      y,
    });
  }
  private mouseupHandler(e: MouseEvent) {
    if (this.isMoving && this.effect) this.effect(this.movePosition);
    this.isMoving = false;
  }
  updateElementStyle(positon: IPosition) {
    const element = this.element;
    this.movePosition = positon;
    element.style.transform = `translate3d(${positon.x}px, ${positon.y}px, 0)`;
  }
  getPostion() {
    return this.movePosition;
  }
  block() {
    this.isMoving = false;
  }
  destory() {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
  }
}

export interface IPosition {
  x: number;
  y: number;
}

export interface MovableParams {
  element: HTMLElement; // 移动的元素
  distance: number; // 容器吸附距离
  container?: HTMLElement; // 相对于移动的父容器
  effect?: (arg: IPosition) => void;
  onMove?: (arg: IPosition) => void;
}

export class Movable {
  element: HTMLElement;
  distance: number;
  container: Element | null;
  offsetParent: HTMLElement;
  translateX: number = 0;
  translateY: number = 0;
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
  protected newPosition: IPosition;
  private onMove: (arg: IPosition) => void;
  constructor({ element, distance, container, effect, onMove }: MovableParams) {
    this.element = element;
    this.distance = distance;
    const offsetParent = element.offsetParent; // 实际布局的相对的容器
    this.offsetParent = offsetParent as HTMLElement;
    this.container = container || (offsetParent as HTMLElement); // 设置得相对的容器
    this.effect = effect;
    this.isMoving = false;
    this.newPosition = { x: 0, y: 0 };
    this.onMove = onMove || (() => { });
  }
  init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
    this.element.addEventListener('mousedown', this.handleMouseDown);
  }
  protected handleMouseDown = (e: MouseEvent) => {
    const element = this.element;
    if (!this.container) return
    if (!element.offsetParent) return // 如果元素不显示就不能移动
    this.isMoving = true;
    this.leftEdge = 0;
    this.rightEdge = this.leftEdge + this.container.clientWidth || 0;
    this.topEdge = 0;
    this.bottomEdge = this.topEdge + this.container.clientHeight || 0;
    //获取元素距离定位父级的x轴及y轴距离
    this.offsetX = this.leftEdge + this.newPosition.x;
    this.offsetY = this.topEdge + this.newPosition.y;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    this.clientX = this.leftEdge + e.clientX;
    this.clientY = this.topEdge + e.clientY;
    //获取此时元素的宽高

    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
  };
  protected mousemoveHandler = (e: MouseEvent) => {
    if (!this.isMoving) return;
    //获取此时鼠标距离视口左上角的x轴及y轴距离

    const clientX2 = e.clientX;
    const clientY2 = e.clientY;
    const { offsetX, offsetY, clientX, clientY } = this;

    //计算此时元素应该距离视口左上角的x轴及y轴距离
    let x = offsetX + (clientX2 - clientX);
    let y = offsetY + (clientY2 - clientY);

    const _pos = this.movementLimit({
      x,
      y,
    });
    this.update(_pos);
    this.onMove(_pos);
  };
  update(positon: IPosition) {
    this.updateElementStyle(positon);
  }
  // 范围限制
  protected movementLimit(pos: IPosition) {
    const {
      width,
      height,
      leftEdge,
      rightEdge,
      topEdge,
      bottomEdge,
      distance,
    } = this;
    let x = pos.x;
    let y = pos.y;
    const L = x;
    const R = x + width;
    const T = y;
    const B = y + height;

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
    return { x, y };
  }
  updateElementStyle(positon: IPosition) {
    this.newPosition = positon;
    this.element.style.setProperty(
      'transform',
      `translate3d(${positon.x + this.translateX}px, ${positon.y + this.translateY
      }px, 0)`,
    );
  }
  protected mouseupHandler = (e: MouseEvent) => {
    if (!this.isMoving) return
    if (this.effect) this.effect(this.newPosition);
    this.isMoving = false;
  };
  getPostion() {
    return this.newPosition;
  }
  block() {
    this.isMoving = false;
  }
  destory() {
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
    document.removeEventListener('mousedown', this.handleMouseDown);
  }
}

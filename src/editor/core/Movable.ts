import { IDirection } from './Editable';

export interface IPosition {
  x: number;
  y: number;
}

export interface MovableParams {
  element: HTMLElement; // 移动的元素
  distance: number; // 容器吸附距离
  effect?: (arg: IPosition) => void;
  onMove?: (arg: IPosition) => void;
}

export class Movable {
  element: HTMLElement;
  distance: number;
  container: Element | null;
  translateX: number = 0;
  translateY: number = 0;
  private effect?: (arg: IPosition) => void;
  private isMoving: boolean;
  private edge: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private mouse: IPosition = { x: 0, y: 0 };
  private offset: IPosition = { x: 0, y: 0 };
  private height: number = 0;
  private width: number = 0;
  protected position: IPosition;
  private onMove: (arg: IPosition) => void;
  constructor({ element, distance, effect, onMove }: MovableParams) {
    this.element = element;
    this.distance = distance;
    const offsetParent = element.offsetParent as HTMLElement; // 实际布局的相对的容器
    this.container = offsetParent as HTMLElement; // 设置得相对的容器
    this.effect = effect;
    this.isMoving = false;
    this.position = { x: 0, y: 0 };
    this.onMove = onMove || (() => {});
  }
  init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
    this.element.addEventListener('mousedown', this.handleMouseDown);
  }
  protected handleMouseDown = (e: MouseEvent) => {
    const { edge, mouse, offset, container, element } = this;
    if (!container) return;
    if (!element.offsetParent) return; // 如果元素不显示就不能移动
    this.isMoving = true;
    edge.left = 0;
    edge.right = edge.left + container.clientWidth || 0;
    edge.top = 0;
    edge.bottom = edge.top + container.clientHeight || 0;
    //获取元素距离定位父级的x轴及y轴距离
    offset.x = edge.left + this.position.x;
    offset.y = edge.top + this.position.y;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    mouse.x = edge.left + e.clientX;
    mouse.y = edge.top + e.clientY;
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
  };
  protected mousemoveHandler = (e: MouseEvent) => {
    if (!this.isMoving) return;
    //获取此时鼠标距离视口左上角的x轴及y轴距离

    const clientX = e.clientX;
    const clientY = e.clientY;
    const { offset, mouse } = this;

    //计算此时元素应该距离视口左上角的x轴及y轴距离
    let x = offset.x + (clientX - mouse.x);
    let y = offset.y + (clientY - mouse.y);

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
    const { width, height, edge, distance } = this;
    let x = pos.x;
    let y = pos.y;
    const left = x;
    const right = x + width;
    const top = y;
    const bottom = y + height;

    // 如果到达左侧的吸附范围，则left置L0
    if (left - edge.left < distance) {
      x = edge.left;
    }
    //如果到达右侧的吸附范围，则left置为R0
    if (edge.right - right < distance) {
      x = edge.right - width;
    }

    //如果到达上侧的吸附范围，则top置T0
    if (top - edge.top < distance) {
      y = edge.top;
    }
    //如果到达右侧的吸附范围，则top置为B0
    if (edge.bottom - bottom < distance) {
      y = edge.bottom - height;
    }
    return { x, y };
  }
  updateElementStyle(positon: IPosition) {
    this.position = positon;
    this.element.style.setProperty(
      'transform',
      `translate3d(${positon.x + this.translateX}px, ${
        positon.y + this.translateY
      }px, 0)`,
    );
  }
  protected mouseupHandler = (e: MouseEvent) => {
    if (!this.isMoving) return;
    if (this.effect) this.effect(this.position);
    this.isMoving = false;
  };
  getPostion() {
    return this.position;
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

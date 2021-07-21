import { IDirection } from './Editable';
import { EditableElement, IPosition } from './EditableElement';

export interface MovableParams {
  editableElement: EditableElement; // 移动的元素
  distance: number; // 容器吸附距离
  effect?: (arg: IPosition) => void;
}

export class Movable {
  editableElement: EditableElement;
  distance: number;
  container: Element | null;
  private effect?: (arg: IPosition) => void;
  private isMoving: boolean;
  private edge: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private mouse: IPosition = { x: 0, y: 0 };
  private offset: IPosition = { x: 0, y: 0 };
  private height: number = 0;
  private width: number = 0;
  constructor({ editableElement, distance, effect }: MovableParams) {
    this.editableElement = editableElement;
    this.distance = distance;
    const offsetParent = editableElement.element.offsetParent as HTMLElement; // 实际布局的相对的容器
    this.container = offsetParent as HTMLElement; // 设置得相对的容器
    this.effect = effect;
    this.isMoving = false;
  }
  init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
    this.editableElement.element.addEventListener(
      'mousedown',
      this.handleMouseDown,
    );
  }
  protected handleMouseDown = (e: MouseEvent) => {
    const { edge, mouse, offset, container, editableElement } = this;
    const element = editableElement.element;
    if (!container) return;
    this.isMoving = true;
    edge.left = 0;
    edge.right = edge.left + container.clientWidth || 0;
    edge.top = 0;
    edge.bottom = edge.top + container.clientHeight || 0;
    //获取元素距离定位父级的x轴及y轴距离
    const rect = editableElement.getRect();
    offset.x = edge.left + rect.x;
    offset.y = edge.top + rect.y;
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
  protected updateElementStyle(positon: IPosition) {
    this.editableElement.updataPosition(positon);
  }
  protected mouseupHandler = (e: MouseEvent) => {
    if (!this.isMoving) return;
    const { x, y } = this.editableElement.getRect();
    if (this.effect) this.effect({ x, y });
    this.isMoving = false;
  };
  block() {
    this.isMoving = false;
  }
  destory() {
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
    document.removeEventListener('mousedown', this.handleMouseDown);
  }
}

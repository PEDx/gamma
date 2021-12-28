import { Editable } from './Editable';
import {
  IEditableElement,
  IPosition,
  IRect,
  IDirection,
} from './EditableElement';

export interface MovableParams {
  element: IEditableElement;
  distance: number; // 容器吸附距离
  effect: (newRect: IRect, oldRect: IRect) => void;
}

export class Movable extends Editable {
  private isMove: boolean;
  private effect: (newRect: IRect, oldRect: IRect) => void;
  constructor({ element, distance, effect }: MovableParams) {
    super({
      element,
      distance,
    });
    this.effect = effect;
    this.isMove = false;
  }
  init() {
    document.addEventListener('mousemove', this.handlerMousemove);
    document.addEventListener('mouseup', this.handlerMouseup);
  }
  protected handleMouseDown = (e: MouseEvent) => {
    this.isMove = true;
  };
  protected handlerMousemove = (e: MouseEvent) => {
    if (!this.isMove) return;
    //获取此时鼠标距离视口左上角的x轴及y轴距离

    const clientX = e.clientX;
    const clientY = e.clientY;
    const { rect, mouse } = this;

    //计算此时元素应该距离视口左上角的x轴及y轴距离

    let x = rect.x + clientX - mouse.x;
    let y = rect.y + clientY - mouse.y;

    const _pos = this.movementLimit({
      x,
      y,
    });
    this.update(_pos);
  };
  update(positon: IPosition) {
    this.updataPosition(positon);
  }
  // 范围限制
  protected movementLimit(pos: IPosition) {
    const { rect, edge, distance } = this;
    const { width, height } = rect;
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
  protected handlerMouseup = (e: MouseEvent) => {
    if (!this.isMove) return;
    const newRect = this.element.getRect();
    this.effect(newRect, this.rect);
    this.isMove = false;
  };
  block() {
    this.isMove = false;
  }
  destory() {
    document.removeEventListener('mousemove', this.handlerMousemove);
    document.removeEventListener('mouseup', this.handlerMouseup);
    document.removeEventListener('mousedown', this.handleMouseDown);
  }
}

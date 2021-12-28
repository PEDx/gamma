import {
  IEditableElement,
  IPosition,
  IRect,
  IDirection,
} from './EditableElement';

export interface IEditableParams {
  element: IEditableElement;
  distance: number; // 容器吸附距离
}

export class Editable {
  element: IEditableElement;
  protected distance: number;
  protected mouse: IPosition = { x: 0, y: 0 };
  protected translate: IPosition = { x: 0, y: 0 };
  protected edge: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  protected offset: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  protected rect: IRect = { x: 0, y: 0, width: 0, height: 0 };
  constructor({ element, distance }: IEditableParams) {
    this.element = element;
    this.distance = distance;
    this.attachEvent();
  }
  private attachEvent() {
    document.addEventListener('mousedown', this.mousedownHandler);
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  private detachEvent() {
    document.removeEventListener('mousedown', this.mousedownHandler);
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
  }
  initElement(rect: IRect) {
    this.updateWidth(rect.width);
    this.updateHeight(rect.height);
    this.updataPosition({ x: rect.x, y: rect.y });
  }
  private mousedownHandler = (e: MouseEvent) => {
    if (!this.element.isActive()) return;

    this.rect = this.element.getRect();
    this.edge = this.element.getEdge();

    const { x, y, width, height } = this.rect;

    this.offset = {
      left: x,
      top: y,
      right: x + width,
      bottom: y + height,
    };

    this.mouse = {
      x: this.edge.left + e.clientX,
      y: this.edge.top + e.clientY,
    };
  };
  private mousemoveHandler = (e: MouseEvent) => {};
  private mouseupHandler = (e: MouseEvent) => {};
  protected updateWidth(value: number) {
    this.element.updateReact('width', Math.round(value));
  }
  protected updateHeight(value: number) {
    this.element.updateReact('height', Math.round(value));
  }
  protected updateX(value: number) {
    this.element.updateReact('x', Math.round(value));
  }
  protected updateY(value: number) {
    this.element.updateReact('y', Math.round(value));
  }
  protected updataPosition(positon: IPosition) {
    this.element.updataPosition(positon);
  }
  protected initElementTranslate(
    container: Element,
    shadowElement: HTMLElement,
  ) {
    const offRect = this.element.getParentRect();
    const conRect = container.getBoundingClientRect();

    /**
     * element 与 shadowElement 的父容器并不重合，因此需要计算偏移量
     * 盒子内部可能会有边距，因此需加上 (offsetLeft 和 offsetTop)
     * shadowElement 的父容器盒子可能有边框，会导致绝对定位不准确，需要加上边框的值(clientLeft 和 clientTop)
     */

    this.translate = {
      x:
        conRect.x - offRect.x + shadowElement.offsetLeft + container.clientLeft,
      y: conRect.y - offRect.y + shadowElement.offsetTop + +container.clientTop,
    };

    this.element.updataOffset(this.translate);
  }
}

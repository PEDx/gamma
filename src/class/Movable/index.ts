import { ViewData } from '@/class/ViewData';

export interface IPosition {
  x: number;
  y: number;
}

export interface MovableParams {
  element: HTMLElement; // 移动的元素
  container?: HTMLElement; // 相对于移动的父容器
  distance: number; // 容器吸附距离
  effect?: (arg: IPosition) => void;
}

export class Movable {
  element: HTMLElement;
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  distance: number;
  container: HTMLElement;
  private offsetParent: HTMLElement;
  private effect?: (arg: IPosition) => void;
  private isMoving: boolean;
  private leftEdge: number = 0;
  private rightEdge: number = 0;
  private topEdge: number = 0;
  private bottomEdge: number = 0;
  private translateX: number = 0;
  private translateY: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private clientX: number = 0;
  private clientY: number = 0;
  private height: number = 0;
  private width: number = 0;
  private movePosition: IPosition;
  overtop: boolean;
  constructor({ element, distance, container, effect }: MovableParams) {
    this.element = element;
    this.distance = distance;
    const offsetParent = element.offsetParent; // 实际布局的相对的容器
    this.offsetParent = offsetParent as HTMLElement;
    this.container = container || (offsetParent as HTMLElement); // 设置得相对的容器
    this.effect = effect;
    this.isMoving = false;
    this.movePosition = { x: 0, y: 0 };
    this.overtop = false;
    this.init();
  }
  private init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  private handleMouseDown = (e: MouseEvent) => {
    const element = this.element;
    this.isMoving = true;
    this.leftEdge = 0;
    this.rightEdge = this.leftEdge + this.container.clientWidth || 0;
    this.topEdge = 0;
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
  };
  private mousemoveHandler = (e: MouseEvent) => {
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

    const _pos = {
      x,
      y,
    };
    this.updateElementStyle(_pos);
    this.updateViewData(_pos);
  };
  private mouseupHandler = (e: MouseEvent) => {
    if (this.isMoving && this.effect) this.effect(this.movePosition);
    this.isMoving = false;
    this.clearShadowElement();
  };

  private initElementByShadow(viewData: ViewData | null) {
    const positon = {
      x: (viewData?.editableConfigurators.x?.value || 0) as number,
      y: (viewData?.editableConfigurators.y?.value || 0) as number,
    };
    this.updateElementStyle(positon);
  }
  private initElementTranslate(container: HTMLElement) {
    const offRect = this.offsetParent.getBoundingClientRect();
    const conRect = container.getBoundingClientRect();
    this.translateX = conRect.x - offRect.x;
    this.translateY = conRect.y - offRect.y;
  }
  private clearShadowElement() {
    if (this.shadowElement)
      this.shadowElement.removeEventListener('mousedown', this.handleMouseDown);
  }
  updateElementStyle(positon: IPosition) {
    const element = this.element;
    this.movePosition = positon;
    element.style.transform = `translate3d(${positon.x + this.translateX}px, ${
      positon.y + this.translateY
    }px, 0)`;
  }
  updateViewData(positon: IPosition) {
    this.viewData!.editableConfigurators?.x?.setValue(positon.x);
    this.viewData!.editableConfigurators?.y?.setValue(positon.y);
  }
  setShadowElement(node: HTMLElement) {
    this.shadowElement = node;
    this.viewData = ViewData.collection.getViewDataByElement(node);
    this.container = node.offsetParent as HTMLElement;
    this.initElementTranslate(this.container);
    this.initElementByShadow(this.viewData);
  }
  attachMouseDownEvent(e: MouseEvent) {
    this.handleMouseDown(e);
  }
  getPostion() {
    return this.movePosition;
  }
  block() {
    this.isMoving = false;
  }
  destory() {
    this.clearShadowElement();
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
  }
}

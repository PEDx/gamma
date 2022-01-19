import {
  IEditableElement,
  IPosition,
  IRectKey,
  IDirection,
  IRect,
  getOffsetParentEdge,
} from './EditableElement';

export interface IEditableDOMElementParams extends Partial<IRect> {
  element: HTMLElement;
}

export class EditableDOMElement implements IEditableElement {
  readonly element: HTMLElement;
  x: number = 0;
  y: number = 0;
  width: number = 0;
  height: number = 0;
  offset: IPosition = { x: 0, y: 0 };
  edge: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private updateMap: { [key: string]: (v: number) => void };
  constructor({ x, y, width, height, element }: IEditableDOMElementParams) {
    this.element = element;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;

    this.updateEdge();

    this.updateMap = {
      x: this.updateXStyle,
      y: this.updateYStyle,
      width: this.updateWidthStyle,
      height: this.updateHeightStyle,
    };
  }
  private updateElementStyle(key: IRectKey, value: number) {
    const _updata = this.updateMap[key];
    _updata(value);
  }
  private updateWidthStyle = (value: number) => {
    this.element.style.setProperty('width', `${value}px`);
  };
  private updateHeightStyle = (value: number) => {
    this.element.style.setProperty('height', `${value}px`);
  };
  private updateXStyle = (value: number) => {
    this.element.style.setProperty(
      'transform',
      `translate3d(${value + this.offset.x}px,${
        this.y + this.offset.y
      }px, 0px)`,
    );
  };
  private updateYStyle = (value: number) => {
    this.element.style.setProperty(
      'transform',
      `translate3d(${this.x + this.offset.x}px,${
        value + this.offset.y
      }px, 0px)`,
    );
  };
  private getParent() {
    /**
     * 如果元素 display = none 那么 offsetParent === null
     */
    return this.element.offsetParent as HTMLElement;
  }
  private getdefaultEdge() {
    return getOffsetParentEdge(this.getParent()); // 位置的相对的容器
  }
  updateReact(key: IRectKey, value: number) {
    this[key] = value;
    this.updateElementStyle(key, value);
  }
  updataPosition({ x, y }: IPosition) {
    this.updateReact('x', x);
    this.updateReact('y', y);
  }
  updataOffset(offset: IPosition) {
    this.offset = offset;
  }
  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
  getEdge() {
    return this.edge;
  }
  updateEdge(props?: IDirection) {
    this.edge = props ? props : this.getdefaultEdge();
  }
  getParentRect() {
    const container = this.getParent();
    const conRect = container.getBoundingClientRect();
    return {
      x: conRect.x,
      y: conRect.y,
      width: conRect.width,
      height: conRect.height,
    };
  }
  isActive() {
    return this.getParent() !== null;
  }
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type IPosition = Pick<IRect, 'x' | 'y'>;

type IRectKey = keyof IRect;

interface IEditableElementParams extends Partial<IRect> {
  element: HTMLElement;
}

export class EditableElement {
  readonly element: HTMLElement;
  private x: number = 0;
  private y: number = 0;
  private width: number = 0;
  private height: number = 0;
  private offset: IPosition = { x: 0, y: 0 };
  private updateMap: { [key: string]: (v: number) => void };
  constructor({ x, y, width, height, element }: IEditableElementParams) {
    this.element = element;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;

    this.updateMap = {
      x: this.updateXStyle,
      y: this.updateYStyle,
      width: this.updateWidthStyle,
      height: this.updateHeightStyle,
    };
  }
  update(key: IRectKey, value: number) {
    this[key] = value;
    this.updateElementStyle(key, value);
  }
  updataPosition({ x, y }: IPosition) {
    this.update('x', x);
    this.update('y', y);
  }
  updateElementStyle(key: IRectKey, value: number) {
    const _updata = this.updateMap[key];
    _updata(value);
  }
  setElementOffset(offset: IPosition) {
    this.offset = offset;
  }
  updateWidthStyle = (value: number) => {
    this.element.style.setProperty('width', `${value}px`);
  };
  updateHeightStyle = (value: number) => {
    this.element.style.setProperty('height', `${value}px`);
  };
  updateXStyle = (value: number) => {
    this.element.style.setProperty(
      'transform',
      `translate3d(${value + this.offset.x}px,${
        this.y + this.offset.y
      }px, 0px)`,
    );
  };
  updateYStyle = (value: number) => {
    this.element.style.setProperty(
      'transform',
      `translate3d(${this.x + this.offset.x}px,${
        value + this.offset.y
      }px, 0px)`,
    );
  };
  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}

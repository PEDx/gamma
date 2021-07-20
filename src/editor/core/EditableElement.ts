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

const updateMap = {
  width: (element: HTMLElement, value: number) =>
    element.style.setProperty('width', `${value}px`),
  height: (element: HTMLElement, value: number) =>
    element.style.setProperty('height', `${value}px`),
  x: (element: HTMLElement, value: number) =>
    element.style.setProperty('left', `${value}px`),
  y: (element: HTMLElement, value: number) =>
    element.style.setProperty('top', `${value}px`),
};

export class EditableElement {
  readonly element: HTMLElement;
  private x: number = 0;
  private y: number = 0;
  private width: number = 0;
  private height: number = 0;
  constructor({ x, y, width, height, element }: IEditableElementParams) {
    this.element = element;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;
  }
  update(key: IRectKey, value: number) {
    this[key] = value;
    this.updateElement(key, value);
  }
  updataRect({ x, y, width, height }: IRect) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  updataPosition({ x, y }: IPosition) {
    this.update('x', x);
    this.update('y', y);
  }
  updataWidth(value: number) {
    this.update('width', value);
  }
  updataHeight(value: number) {
    this.update('width', value);
  }
  updateElement(key: IRectKey, value: number) {
    const updata = updateMap[key];
    updata(this.element, value);
  }
  getRect() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}

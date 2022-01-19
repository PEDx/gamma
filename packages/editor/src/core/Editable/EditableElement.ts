export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IDirection {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export type IPosition = Pick<IRect, 'x' | 'y'>;

export type IRectKey = keyof IRect;

export interface IEditableElement {
  x: number;
  y: number;
  width: number;
  height: number;
  offset: IPosition;
  /**
   * 更新元素的几何属性
   */
  updateReact(key: IRectKey, value: number): void;
  /**
   * 更新元素的位置
   */
  updataPosition(props: IPosition): void;
  /**
   * 更新元素的偏移
   */
  updataOffset(props: IPosition): void;
  /**
   * 更新元素的边界
   */
  updateEdge(props?: IDirection): void;
  /**
   * 获取元素的几何属性
   */
  getRect(): IRect;
  /**
   * 获取父元素几何属性
   */
  getParentRect(): IRect;
  /**
   * 获取元素的边界
   */
  getEdge(): IDirection;
  /**
   * 是否是可用状态
   */
  isActive(): Boolean;
}

export function getOffsetParentEdge(element: HTMLElement): IDirection {
  const parent = element.offsetParent as HTMLElement;
  return {
    top: 0,
    bottom: parent.clientHeight || 0,
    left: 0,
    right: parent.clientWidth || 0,
  };
}

/**
 * scrollHeight = scroll_bar ? large_block : clientHeight
 * clientHeight = container_height + padding
 * offsetHeight = clientHeight + border + scroll_bar_height
 */

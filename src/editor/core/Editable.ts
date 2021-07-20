import { DIRECTIONS } from '@/utils';
import { IPosition, Movable } from '@/editor/core/Movable';

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type editableConfiguratorType = 'width' | 'height';

export interface IEditable {
  element: HTMLElement; // 移动的元素
  distance: number; // 容器吸附距离
  effect?: (newRect: IRect, oldRect: IRect) => void;
}

export interface IDirection {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

const MIN_SIZE = 10;

export class Editable {
  element: HTMLElement;
  distance: number;
  container: HTMLElement;
  protected movable: Movable;
  private effect?: (newRect: IRect, oldRect: IRect) => void;
  private isEditing: boolean;
  private edge: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private offset: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private mouse: IPosition = { x: 0, y: 0 };
  private aspectRatio: number = 0.5;
  private direction: DIRECTIONS = DIRECTIONS.NULL;
  private rect: IRect = { x: 0, y: 0, width: 0, height: 0 };
  constructor({ element, distance, effect }: IEditable) {
    this.element = element;
    this.distance = distance;
    const offsetParent = element.offsetParent; // 实际布局的相对的容器
    this.container = offsetParent as HTMLElement; // 设置得相对的容器
    this.movable = new Movable({
      element: element,
      distance: 10,
      effect: this._effect,
    });
    this.effect = effect;
    this.isEditing = false;
    this.init();
  }
  private init() {
    this.element.addEventListener('mousedown', this.handleMouseDown);
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  private handleMouseDown = (e: MouseEvent) => {
    const { edge, offset, mouse, rect } = this;
    const { width, height } = rect;
    this.isEditing = true;

    edge.left = 0;
    edge.right = this.container.clientWidth || 0;
    edge.top = 0;
    edge.bottom = this.container.clientHeight || 0;

    //获取元素距离定位父级的x轴及y轴距离
    const movePosition = this.movable.getPostion();

    offset.left = edge.left + movePosition.x;
    offset.top = edge.top + movePosition.y;
    offset.right = offset.left + width;
    offset.bottom = offset.top + height;

    //获取此时鼠标距离视口左上角的x轴及y轴距离
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  private mousemoveHandler = (e: MouseEvent) => {
    if (this.direction === DIRECTIONS.NULL) return;

    const { mouse } = this;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    const clientX = e.clientX;
    const clientY = e.clientY;

    const diffY = clientY - mouse.y;
    const diffX = clientX - mouse.x;

    const rect = this.sizeLimit(this.computedNewRect(diffX, diffY));

    if (this.direction & (DIRECTIONS.L | DIRECTIONS.R)) {
      this.update('width', rect.width);
    }
    if (this.direction & (DIRECTIONS.T | DIRECTIONS.B)) {
      this.update('height', rect.height);
    }
    if (this.direction & (DIRECTIONS.T | DIRECTIONS.L)) {
      this.movable.update({ x: rect.x, y: rect.y });
    }
  };
  protected computedNewRect(diffX: number, diffY: number) {
    const { offset, rect, direction } = this;
    const { width, height } = rect;

    let editWidth = width;
    let editHeight = height;
    let editTop = offset.top;
    let editLeft = offset.left;

    if (direction & DIRECTIONS.L) {
      editWidth = width - diffX;
      editLeft = offset.left + diffX;
    }

    if (direction & DIRECTIONS.R) {
      editWidth = width + diffX;
    }

    if (direction & DIRECTIONS.T) {
      editTop = offset.top + diffY;
      editHeight = height - diffY;
    }

    if (direction & DIRECTIONS.B) {
      editHeight = height + diffY;
    }
    return {
      width: editWidth,
      height: editHeight,
      x: editLeft,
      y: editTop,
    };
  }
  // 范围限制
  protected sizeLimit(_rect: IRect) {
    const { offset, edge, rect, distance, direction } = this;
    const { width, height } = rect;

    this.edge.bottom = this.container.clientHeight || 0;

    let editWidth = _rect.width;
    let editHeight = _rect.height;
    let editLeft = _rect.x;
    let editTop = _rect.y;

    // 最小尺寸限定
    if (editWidth < MIN_SIZE) {
      editWidth = MIN_SIZE;
      if (direction & DIRECTIONS.R) {
        editLeft = offset.left;
      }
      if (direction & DIRECTIONS.L) {
        editLeft = offset.right - MIN_SIZE;
      }
    }

    if (editHeight < MIN_SIZE) {
      editHeight = MIN_SIZE;
      if (direction & DIRECTIONS.B) {
        editTop = offset.top;
      }
      if (direction & DIRECTIONS.T) {
        editTop = offset.bottom - MIN_SIZE;
      }
    }

    if (
      direction & DIRECTIONS.R &&
      editWidth + editLeft > edge.right - distance
    ) {
      // TODO 完善吸附功能
      // TODO 添加辅助线功能

      //范围限定及贴边吸附
      // 限制右边界 吸附
      editWidth = edge.right - offset.left;
    }
    // 限制下边界 吸附
    if (
      direction & DIRECTIONS.B &&
      editHeight + editTop > edge.bottom - distance
    ) {
      editHeight = edge.bottom - offset.top;
    }
    // 限制左边界 吸附
    if (direction & DIRECTIONS.L && editLeft < edge.left + distance) {
      editLeft = edge.left;
      editWidth = width + offset.left;
    }
    // 限制上边界 吸附
    if (direction & DIRECTIONS.T && editTop < edge.top + distance) {
      editTop = edge.top;
      editHeight = height + offset.top;
    }

    return {
      width: editWidth,
      height: editHeight,
      x: editLeft,
      y: editTop,
    };
  }
  private mouseupHandler = (e: MouseEvent) => {
    if (this.isEditing) this._effect();
    this.isEditing = false;
    this.direction = DIRECTIONS.NULL;
  };
  protected _effect = () => {
    if (!this.effect) return;
    const movePosition = this.movable.getPostion();
    const newRect = {
      ...movePosition,
      width: this.element.clientWidth,
      height: this.element.clientHeight,
    };
    this.effect(newRect, this.rect);
    this.rect = newRect;
  };
  protected update(key: editableConfiguratorType, value: number) {
    this.updateElementStyle(key, value);
  }
  protected updateElementStyle(key: editableConfiguratorType, value: number) {
    const element = this.element;
    element.style.setProperty(key, `${value}px`);
  }
  setAspectRatio(aspectRatio: number) {
    this.aspectRatio = aspectRatio;
  }
  initRect(width: number, height: number) {
    const movePosition = this.movable.getPostion();
    const rect = {
      ...movePosition,
      width,
      height,
    };
    this.rect = { ...rect };
  }
  setDirection(direction: DIRECTIONS) {
    this.movable.block();
    this.direction = direction;
  }
  destory() {
    this.element.removeEventListener('mousedown', this.handleMouseDown);
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
  }
}

import { DIRECTIONS } from '@/utils';
import { Movable } from '@/class/Movable';

interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type editableConfiguratorType = 'width' | 'height';

export interface IEditable {
  element: HTMLElement; // 移动的元素
  distance: number; // 容器吸附距离
  container?: HTMLElement; // 相对于移动的父容器
  effect?: (arg: IRect) => void;
}

const MIN_SIZE = 10;

export class Editable {
  element: HTMLElement;
  distance: number;
  container: HTMLElement;
  protected movable: Movable;
  private effect?: (arg: IRect) => void;
  private isEditing: boolean;
  private leftEdge: number = 0;
  private rightEdge: number = 0;
  private topEdge: number = 0;
  private bottomEdge: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private clientX: number = 0;
  private clientY: number = 0;
  private height: number = 0;
  private width: number = 0;
  private direction: DIRECTIONS = DIRECTIONS.NULL;
  offsetRight: number = 0;
  offsetBottom: number = 0;
  constructor({ element, distance, container, effect }: IEditable) {
    this.element = element;
    this.distance = distance;
    const offsetParent = element.offsetParent; // 实际布局的相对的容器
    this.container = container || (offsetParent as HTMLElement); // 设置得相对的容器
    this.movable = new Movable({
      element: element,
      container: container,
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
    const element = this.element;
    this.isEditing = true;

    this.leftEdge = 0;
    this.rightEdge = this.container.clientWidth || 0;
    this.topEdge = 0;
    this.bottomEdge = this.container.clientHeight || 0;

    //获取元素距离定位父级的x轴及y轴距离
    const movePosition = this.movable.getPostion();
    this.offsetX = this.leftEdge + movePosition.x;
    this.offsetY = this.topEdge + movePosition.y;

    //获取此时鼠标距离视口左上角的x轴及y轴距离
    this.clientX = e.clientX;
    this.clientY = e.clientY;

    //获取此时元素的宽高
    this.width = element.offsetWidth;
    this.height = element.offsetHeight;

    this.offsetRight = this.offsetX + this.width;
    this.offsetBottom = this.offsetY + this.height;
  };
  private mousemoveHandler = (e: MouseEvent) => {
    if (this.direction === DIRECTIONS.NULL) return;

    const { clientX, clientY } = this;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    const clientX2 = e.clientX;
    const clientY2 = e.clientY;

    const diffY = clientY2 - clientY;
    const diffX = clientX2 - clientX;

    const rect = this.sizeLimit(this.computedNewRect(diffX, diffY));

    // TODO 考虑批处理更新样式

    if (this.direction & (DIRECTIONS.L | DIRECTIONS.R)) {
      this.updata('width', rect.width);
    }
    if (this.direction & (DIRECTIONS.T | DIRECTIONS.B)) {
      this.updata('height', rect.height);
    }
    if (this.direction & (DIRECTIONS.T | DIRECTIONS.L)) {
      this.movable.updata({ x: rect.x, y: rect.y });
    }
  };
  protected computedNewRect(diffX: number, diffY: number) {
    const { offsetX, offsetY, width, height, direction } = this;

    let editWidth = width;
    let editHeight = height;
    let editTop = offsetY;
    let editLeft = offsetX;

    if (direction & DIRECTIONS.L) {
      editWidth = width - diffX;
      editLeft = offsetX + diffX;
    }

    if (direction & DIRECTIONS.R) {
      editWidth = width + diffX;
    }

    if (direction & DIRECTIONS.T) {
      editTop = offsetY + diffY;
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
  protected sizeLimit(rect: IRect) {
    const {
      offsetX,
      offsetY,
      leftEdge,
      rightEdge,
      topEdge,
      bottomEdge,
      width,
      height,
      distance,
      direction,
    } = this;

    this.bottomEdge = this.container.clientHeight || 0;

    let editWidth = rect.width;
    let editHeight = rect.height;
    let editLeft = rect.x;
    let editTop = rect.y;

    // 最小尺寸限定
    if (editWidth < MIN_SIZE) {
      editWidth = MIN_SIZE;
      if (direction & DIRECTIONS.R) {
        editLeft = offsetX;
      }
      if (direction & DIRECTIONS.L) {
        editLeft = this.offsetRight - MIN_SIZE;
      }
    }

    if (editHeight < MIN_SIZE) {
      editHeight = MIN_SIZE;
      if (direction & DIRECTIONS.B) {
        editTop = offsetY;
      }
      if (direction & DIRECTIONS.T) {
        editTop = this.offsetBottom - MIN_SIZE;
      }
    }

    // TODO 完善吸附功能
    // TODO 添加辅助线功能

    //范围限定及贴边吸附
    // 限制右边界 吸附
    if (
      direction & DIRECTIONS.R &&
      editWidth + editLeft > rightEdge - distance
    ) {
      editWidth = rightEdge - offsetX;
    }
    // 限制下边界 吸附
    if (
      direction & DIRECTIONS.B &&
      editHeight + editTop > bottomEdge - distance
    ) {
      editHeight = bottomEdge - offsetY;
    }
    // 限制左边界 吸附
    if (direction & DIRECTIONS.L && editLeft < leftEdge + distance) {
      editLeft = leftEdge;
      editWidth = width + offsetX;
    }
    // 限制上边界 吸附
    if (direction & DIRECTIONS.T && editTop < topEdge + distance) {
      editTop = topEdge;
      editHeight = height + offsetY;
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
  private _effect = () => {
    if (!this.effect) return;
    const movePosition = this.movable.getPostion();
    this.effect({
      ...movePosition,
      width: this.element.clientWidth,
      height: this.element.clientHeight,
    });
  };
  protected updata(key: editableConfiguratorType, value: number) {
    this.updateElementStyle(key, value);
  }
  protected updateElementStyle(key: editableConfiguratorType, value: number) {
    const element = this.element;
    element.style.setProperty(key, `${value}px`);
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

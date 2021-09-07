import { DIRECTIONS } from '@/utils';
import { EditableElement, IPosition, IRect } from './EditableElement';

export type editableConfiguratorType = 'width' | 'height' | 'x' | 'y';

export interface IEditable {
  editableElement: EditableElement;
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
  editableElement: EditableElement;
  distance: number;
  container: HTMLElement;
  protected aspectRatio: number = 0; // 宽高比
  private effect?: (newRect: IRect, oldRect: IRect) => void;
  private isEditing: boolean;
  private edge: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private offset: IDirection = { top: 0, bottom: 0, left: 0, right: 0 };
  private mouse: IPosition = { x: 0, y: 0 };
  private direction: DIRECTIONS = DIRECTIONS.NULL;
  protected rect: IRect = { x: 0, y: 0, width: 0, height: 0 };
  constructor({ editableElement, distance, effect }: IEditable) {
    this.editableElement = editableElement;
    this.distance = distance;
    const offsetParent = editableElement.element.offsetParent; // 实际布局的相对的容器
    this.container = offsetParent as HTMLElement; // 设置得相对的容器
    this.effect = effect;
    this.isEditing = false;
    this.init();
  }
  private init() {
    this.editableElement.element.addEventListener(
      'mousedown',
      this.handleMouseDown,
    );
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  private handleMouseDown = (e: MouseEvent) => {
    const { edge, offset, mouse } = this;
    this.rect = this.editableElement.getRect();
    this.isEditing = true;

    edge.left = 0;
    edge.right = this.container.clientWidth || 0;
    edge.top = 0;
    edge.bottom = this.container.clientHeight || 0;

    //获取元素距离定位父级的x轴及y轴距离
    const { x, y, width, height } = this.rect;

    offset.left = edge.left + x;
    offset.top = edge.top + y;
    offset.right = offset.left + width;
    offset.bottom = offset.top + height;

    //获取此时鼠标距离视口左上角的x轴及y轴距离
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  };
  private mousemoveHandler = (e: MouseEvent) => {
    const { mouse, rect, direction } = this;

    if (direction === DIRECTIONS.NULL) return;

    //获取此时鼠标距离视口左上角的x轴及y轴距离
    const clientX = e.clientX;
    const clientY = e.clientY;

    const diffY = clientY - mouse.y;
    const diffX = clientX - mouse.x;

    let newRect = this.computedNewRect(diffX, diffY);

    newRect = this.sizeLimit(newRect); // 尺寸限制

    const ratio = this.aspectRatio;

    if (direction & (DIRECTIONS.L | DIRECTIONS.R)) {
      this.updateWidth(newRect.width);
      if (ratio) {
        newRect.height = newRect.width / ratio;
        this.updateHeight(newRect.height);
        if (direction & DIRECTIONS.T) {
          newRect.y = rect.y - (newRect.height - rect.height);
          this.updateY(newRect.y);
        }
      }
    }
    if (direction & (DIRECTIONS.T | DIRECTIONS.B)) {
      this.updateHeight(newRect.height);
      if (ratio) {
        newRect.width = newRect.height * ratio;
        this.updateWidth(newRect.width);
        if (direction & DIRECTIONS.L) {
          newRect.x = rect.x - (newRect.width - rect.width);
          this.updateX(newRect.x);
        }
      }
    }
    if (direction & DIRECTIONS.T) {
      this.updateY(newRect.y);
    }
    if (direction & DIRECTIONS.L) {
      this.updateX(newRect.x);
    }
  };
  private aspectRatioLimit(newRect: IRect) {}
  protected computedNewRect(diffX: number, diffY: number) {
    const { rect, direction } = this;
    const { width, height, x, y } = rect;

    let editWidth = width;
    let editHeight = height;
    let editTop = y;
    let editLeft = x;

    if (direction & DIRECTIONS.L) {
      editWidth = width - diffX;
      editLeft = x + diffX;
    }

    if (direction & DIRECTIONS.R) {
      editWidth = width + diffX;
    }

    if (direction & DIRECTIONS.T) {
      editTop = y + diffY;
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
    // 范围限制
  }
  protected sizeLimit(_rect: IRect) {
    const { offset, edge, rect, distance, direction } = this;
    const { width, height } = rect;

    this.edge.bottom = this.container.clientHeight || 0;

    let editWidth = _rect.width;
    let editHeight = _rect.height;
    let editLeft = _rect.x;
    let editTop = _rect.y;

    // 最小尺寸限定
    if (editWidth <= MIN_SIZE) {
      editWidth = MIN_SIZE;
      if (direction & DIRECTIONS.R) {
        editLeft = offset.left;
      }
      if (direction & DIRECTIONS.L) {
        editLeft = offset.right - MIN_SIZE;
      }
    }

    if (editHeight <= MIN_SIZE) {
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
    const newRect = this.editableElement.getRect();
    this.effect(newRect, this.rect);
  };
  protected update(key: editableConfiguratorType, value: number) {
    this.editableElement.update(key, value);
  }
  protected updateWidth(value: number) {
    this.editableElement.update('width', value);
  }
  protected updateHeight(value: number) {
    this.editableElement.update('height', value);
  }
  protected updateX(value: number) {
    this.editableElement.update('x', value);
  }
  protected updateY(value: number) {
    this.editableElement.update('y', value);
  }
  setDirection(direction: DIRECTIONS) {
    this.direction = direction;
  }
  destory() {
    this.editableElement.element.removeEventListener(
      'mousedown',
      this.handleMouseDown,
    );
    document.removeEventListener('mousemove', this.mousemoveHandler);
    document.removeEventListener('mouseup', this.mouseupHandler);
  }
}

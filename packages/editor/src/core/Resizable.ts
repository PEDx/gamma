import { DIRECTIONS } from '@/utils';
import { Editable } from './Editable';
import { IEditableElement, IRect } from './EditableElement';

export interface IResizableParams {
  element: IEditableElement;
  distance: number; // 容器吸附距离
  limit: boolean; // 是否限制尺寸
  effect?: (newRect: IRect, oldRect: IRect) => void;
}

const MIN_SIZE = 10;

export class Resizable extends Editable {
  protected aspectRatio: number = 0; // 宽高比
  private limit: boolean;
  private isResize: boolean = false;
  private direction: DIRECTIONS = DIRECTIONS.NULL;
  private effect?: (newRect: IRect, oldRect: IRect) => void;
  constructor({ element, distance, effect, limit = true }: IResizableParams) {
    super({ element, distance });
    this.effect = effect;
    this.limit = limit;
    this.init();
  }
  private init() {
    document.addEventListener('mousedown', this.handleMousedown);
    document.addEventListener('mousemove', this.handlerMousemove);
    document.addEventListener('mouseup', this.handlerMouseup);
  }
  private handleMousedown = (e: MouseEvent) => {
    this.isResize = true;
  };
  private handlerMousemove = (e: MouseEvent) => {
    const { mouse, rect, direction } = this;

    const isPressShiftKey = e.shiftKey;

    if (direction === DIRECTIONS.NULL) return;

    //获取此时鼠标距离视口左上角的x轴及y轴距离
    const clientX = e.clientX;
    const clientY = e.clientY;

    const diffY = clientY - mouse.y;
    const diffX = clientX - mouse.x;

    let newRect = this.computedNewRect(diffX, diffY);

    if (this.limit) newRect = this.sizeLimit(newRect); // 尺寸限制

    let ratio = this.aspectRatio;

    if (isPressShiftKey) {
      ratio = rect.width / rect.height;
    }

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
  private computedNewRect(diffX: number, diffY: number) {
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
  private sizeLimit(_rect: IRect) {
    const { offset, edge, rect, distance, direction } = this;
    const { width, height } = rect;

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
  private handlerMouseup = (e: MouseEvent) => {
    if (this.isResize) this._effect();
    this.isResize = false;
    this.direction = DIRECTIONS.NULL;
  };
  private _effect = () => {
    if (!this.effect) return;
    const newRect = this.element.getRect();
    this.effect(newRect, this.rect);
  };
  setDirection(direction: DIRECTIONS) {
    this.direction = direction;
  }
  destory() {
    document.removeEventListener('mousedown', this.handleMousedown);
    document.removeEventListener('mousemove', this.handlerMousemove);
    document.removeEventListener('mouseup', this.handlerMouseup);
  }
}

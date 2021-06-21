export interface DragTransferData {
  type: string;
}

export enum DragType {
  widget,
  resource,
  unkonw,
}

export interface DragMeta {
  type: DragType;
  data?: any;
}

interface DragParams<T extends DragMeta> {
  node: HTMLElement;
  type: T['type'];
  data?: T['data'];
  onDragstart?: (e: Event) => void;
  onDragend?: (e: Event) => void;
}

export class DragItem<T extends DragMeta> {
  node: HTMLElement;
  onDragstart?: (e: Event) => void;
  onDragend?: (e: Event) => void;
  private _originCursor: string;
  meta: { type: T['type']; data: T['data'] | undefined };
  constructor({ node, type, data, onDragstart, onDragend }: DragParams<T>) {
    this.node = node;
    this.meta = {
      type,
      data,
    };
    this.onDragstart = onDragstart;
    this.onDragend = onDragend;
    this._originCursor = this.node.style.cursor;
    this.node.setAttribute('draggable', 'true');
    this.init();
  }
  init() {
    this.node.addEventListener('dragstart', this.handleDragstart);
    this.node.addEventListener('dragend', this.handleDragend);
  }
  handleDragstart = (e: Event) => {
    const evt = e as DragEvent;
    this.node.style.setProperty('cursor', `grabbing`);

    const metaStr = JSON.stringify(this.meta);
    evt.dataTransfer!.setData('text', metaStr);
    evt.dataTransfer!.effectAllowed = 'move';

    this.onDragstart && this.onDragstart(e);
  };
  handleDragend = (e: Event) => {
    this.node.style.setProperty('cursor', this._originCursor);

    this.onDragend && this.onDragend(e);
  };
  destory() {
    this.node.removeEventListener('dragstart', this.handleDragstart);
    this.node.removeEventListener('dragend', this.handleDragend);
  }
}
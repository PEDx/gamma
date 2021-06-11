export interface DragTransferData {
  type: string;
}

export type DragType = 'widget' | 'resource' | 'unkonw';

export interface DragMeta {
  type: DragType;
}

interface DragParams<T> {
  node: HTMLElement;
  meta: T;
  onDragstart?: (e: Event) => void;
  onDragend?: (e: Event) => void;
}

export class DragItem<T extends DragMeta> {
  node: HTMLElement;
  meta: T;
  onDragstart?: (e: Event) => void;
  onDragend?: (e: Event) => void;
  private _originCursor: string;
  constructor({ node, meta, onDragstart, onDragend }: DragParams<T>) {
    this.node = node;
    this.meta = meta;
    this.onDragstart = onDragstart;
    this.onDragend = onDragend;
    this.node.setAttribute('draggable', 'true');
    this.init();
    this._originCursor = this.node.style.cursor;
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

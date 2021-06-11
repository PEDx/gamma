const DRAG_ITEM_DRAGSTART = 'drag-item-dragstart';

export interface DragTransferData {
  type: string;
}

export type DragType = 'widget' | 'resource' | 'unkonw';

export interface DragMeta {
  type: string;
}

interface DragParams<T> {
  node: Element;
  meta: T;
  onDragstart?: (e: Event) => void;
  onDragend?: (e: Event) => void;
}

export class DragItem<T extends DragMeta> {
  node: Element;
  meta: T;
  onDragstart?: (e: Event) => void;
  onDragend?: (e: Event) => void;
  constructor({ node, meta, onDragstart, onDragend }: DragParams<T>) {
    this.node = node;
    this.meta = meta;
    this.onDragstart = onDragstart;
    this.onDragend = onDragend;
    this.node.setAttribute('draggable', 'true');
    this.init();
  }
  init() {
    this.node.addEventListener('dragstart', this.handleDragstart);
    this.node.addEventListener('dragend', this.handleDragend);
  }
  handleDragstart = (e: Event) => {
    const evt = e as DragEvent;
    this.node.classList.add(DRAG_ITEM_DRAGSTART);

    const metaStr = JSON.stringify(this.meta);
    evt.dataTransfer!.setData('text', metaStr);
    evt.dataTransfer!.effectAllowed = 'move';

    this.onDragstart && this.onDragstart(e);
  };
  handleDragend = (e: Event) => {
    this.node.classList.remove(DRAG_ITEM_DRAGSTART);

    this.onDragend && this.onDragend(e);
  };
  destory() {
    this.node.removeEventListener('dragstart', this.handleDragstart);
    this.node.removeEventListener('dragend', this.handleDragend);
  }
}

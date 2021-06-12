import { DragType, DragMeta } from './drag';

interface DropParams {
  node: Element;
  type: DragType;
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragend?: (e: DragEvent) => void;
}

export const setDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', `1px solid rgb(227 118 2)`);
};

export const clearDragEnterStyle = (node: HTMLElement) => {
  node.style.setProperty('outline', ``);
};

export class DropItem<T extends DragMeta> {
  node: Element;
  type: DragType;
  private block: boolean;
  onDragenter?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragend?: (e: DragEvent) => void;
  constructor({
    node,
    type,
    onDragenter,
    onDragover,
    onDragleave,
    onDragend,
    onDrop,
  }: DropParams) {
    this.node = node;
    this.onDragenter = onDragenter;
    this.onDragover = onDragover;
    this.onDragleave = onDragleave;
    this.onDrop = onDrop;
    this.onDragend = onDragend;
    this.node = node;
    this.type = type;
    this.block = false;
    this.init();
  }
  init() {
    this.node.addEventListener('dragenter', this.handleDragenter);
    this.node.addEventListener('dragover', this.handleDragover);
    this.node.addEventListener('dragleave', this.handleDragleave);
    this.node.addEventListener('drop', this.handleDrop);
    document.addEventListener('dragend', (evt) => {
      this.onDragend && this.onDragend(evt);
      this.block = false;
    });
    document.addEventListener('dragstart', (evt) => {
      if (!this.getMatchDragType(evt)) this.block = true;
    });
  }
  handleDragenter = (e: Event) => {
    if (this.block) return;
    const evt = e as DragEvent;
    this.onDragenter && this.onDragenter(evt);

    return true;
  };
  handleDragover = (e: Event) => {
    if (this.block) return;
    const evt = e as DragEvent;
    this.onDragover && this.onDragover(evt);
    e.preventDefault();
    return true;
  };
  handleDragleave = (e: Event) => {
    if (this.block) return;
    const evt = e as DragEvent;
    this.onDragleave && this.onDragleave(evt);
    return false;
  };
  handleDrop = (e: Event) => {
    if (this.block) return;
    const evt = e as DragEvent;
    this.onDrop && this.onDrop(evt);
    return false;
  };
  getMatchDragType(evt: DragEvent): boolean {
    const meta = this.getDragMeta(evt);
    if (meta === null) return false;
    if (meta.type !== this.type) return false;
    return true;
  }
  getDragMeta(evt: DragEvent) {
    const metaStr = evt.dataTransfer!.getData('text');
    if (!metaStr) return null;
    let meta = JSON.parse(metaStr) as T;
    return meta;
  }
  destory() {}
}

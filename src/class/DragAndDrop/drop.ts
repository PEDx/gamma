import { DragTransferData } from './drag';

interface DropParams<T extends DragTransferData> {
  node: Element;
  meta: T;
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragend?: (e: DragEvent) => void;
}

export class DropItem<T extends DragTransferData> {
  node: Element;
  meta: T;
  private block: boolean;
  onDragenter?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragend?: (e: DragEvent) => void;
  constructor({
    node,
    meta,
    onDragenter,
    onDragover,
    onDragleave,
    onDragend,
    onDrop,
  }: DropParams<T>) {
    this.node = node;
    this.onDragenter = onDragenter;
    this.onDragover = onDragover;
    this.onDragleave = onDragleave;
    this.onDrop = onDrop;
    this.onDragend = onDragend;
    this.node = node;
    this.meta = meta;
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
      if (!this.getDragMeta(evt)) this.block = true;
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
    if (!this.getDragMeta(evt)) return;
    this.onDrop && this.onDrop(evt);
    return false;
  };
  getDragMeta(evt: DragEvent) {
    const metaStr = evt.dataTransfer!.getData('text');
    if (!metaStr) return;
    const meta = JSON.parse(metaStr) as T;
    if (meta.type !== this.meta.type) return null;
    return meta;
  }
  destory() {}
}

import { DragTransferData } from './drag';

interface DropParams<T extends DragTransferData> {
  node: Element;
  meta: T;
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
}

const DRAG_ENTER_CLASSNAME = 'm-box-drag-enter';

export class DropItem<T extends DragTransferData> {
  node: Element;
  meta: T;
  private block: boolean;
  onDragenter?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  constructor({
    node,
    meta,
    onDragenter,
    onDragover,
    onDragleave,
    onDrop,
  }: DropParams<T>) {
    this.node = node;
    this.onDragenter = onDragenter;
    this.onDragover = onDragover;
    this.onDragleave = onDragleave;
    this.onDrop = onDrop;
    this.node = node;
    this.meta = meta;
    this.block = false;
  }
  init() {
    this.node.addEventListener('dragenter', this.handleDragenter);
    this.node.addEventListener('dragover', this.handleDragenter);
    this.node.addEventListener('dragleave', this.handleDragenter);
    this.node.addEventListener('drop', this.handleDragenter);
  }
  handleDragenter = (e: Event) => {
    const evt = e as DragEvent;
    if (this.getDragType(evt)) {
      this.block = true;
      return;
    }
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
    this.block = false;
    const evt = e as DragEvent;
    this.onDragenter && this.onDragenter(evt);
    return false;
  };
  handleDrop = (e: Event) => {
    if (this.block) return;
    const evt = e as DragEvent;
    this.onDragenter && this.onDragenter(evt);
    return false;
  };
  getDragType(evt: DragEvent) {
    const metaStr = evt.dataTransfer!.getData('text');
    const meta = JSON.parse(metaStr) as T;
    if (meta.type !== this.meta.type) return false;
    return true;
  }
  destory() {}
}

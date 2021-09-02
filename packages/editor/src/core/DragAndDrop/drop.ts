import { DragMeta } from './drag';

interface DropParams<T extends DragMeta> {
  node: Element;
  type: T['type'];
  onDragenter?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragend?: (e: DragEvent) => void;
  onDragstart?: (e: DragEvent) => void;
}
export class DropItem<T extends DragMeta> {
  node: Element;
  type: T['type'];
  private block: boolean;
  onDragenter?: (e: DragEvent) => void;
  onDragover?: (e: DragEvent) => void;
  onDragleave?: (e: DragEvent) => void;
  onDrop?: (e: DragEvent) => void;
  onDragend?: (e: DragEvent) => void;
  onDragstart?: (e: DragEvent) => void;
  constructor({
    node,
    type,
    onDragenter,
    onDragover,
    onDragleave,
    onDragend,
    onDragstart,
    onDrop,
  }: DropParams<T>) {
    this.node = node;
    this.onDragenter = onDragenter;
    this.onDragover = onDragover;
    this.onDragleave = onDragleave;
    this.onDrop = onDrop;
    this.onDragend = onDragend;
    this.onDragstart = onDragstart;
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
    document.addEventListener('dragend', this.handleDragend);
    document.addEventListener('dragstart', this.handleDragtart);
  }
  handleDragend = (e: DragEvent) => {
    this.onDragend && this.onDragend(e);
    this.block = false;
  };
  handleDragtart = (e: DragEvent) => {
    this.onDragstart && this.onDragstart(e);
    if (!this.getMatchDragType(e)) this.block = true;
  };
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
  destory() {
    this.node.removeEventListener('dragenter', this.handleDragenter);
    this.node.removeEventListener('dragover', this.handleDragover);
    this.node.removeEventListener('dragleave', this.handleDragleave);
    this.node.removeEventListener('drop', this.handleDrop);
    document.removeEventListener('dragend', this.handleDragend);
    document.removeEventListener('dragstart', this.handleDragtart);
  }
}

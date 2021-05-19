export interface DraggableParams {
  element: HTMLElement;
  ghostElement: HTMLElement;
}

const previewImage = new Image();
previewImage.src =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";

export class Draggable {
  element: HTMLElement;
  ghostElement: HTMLElement;
  cloneObj: HTMLElement | undefined;
  startX: number = 0;
  startY: number = 0;
  offsetX: number = 0;
  offsetY: number = 0;
  constructor({ element, ghostElement }: DraggableParams) {
    this.element = element;
    this.ghostElement = ghostElement;
    this.initEvent();
  }
  private initEvent() {
    this.element.addEventListener('dragstart', this.handleDargstart);
    this.element.addEventListener('dragend', this.handleDargend);
    document.addEventListener('dragover', this.handleDargover);
  }
  private handleDargstart = (e: DragEvent) => {
    if (!e.dataTransfer) return;
    e.dataTransfer.setData('text', '');
    e.dataTransfer.setDragImage(previewImage, 0, 0);
    this.createGhostElement(e);
  };
  private handleDargend = (e: DragEvent) => {};
  private handleDargover = (e: DragEvent) => {
    if (!this.cloneObj) return;
    var left = ~~(e.clientX - this.offsetX);
    var top = ~~(e.clientY - this.offsetY);
    this.startX = left + this.offsetX;
    this.startY = top + this.offsetY;
    this.cloneObj.style.transform =
      'translate3d( ' + left + 'px ,' + top + 'px,0)';
  };
  private createGhostElement(e: DragEvent) {
    console.log(e);

    const rect = this.element.getBoundingClientRect();
    const left = rect.left;
    const top = rect.top;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.offsetX = this.startX - left;
    this.offsetY = this.startY - top;
    const cloneObj = document.createElement('DIV');

    cloneObj.style.width = this.ghostElement.offsetWidth + 'px';
    cloneObj.style.height = this.ghostElement.offsetHeight + 'px';
    cloneObj.style.transform = 'translate3d(0,0,0)';
    cloneObj.style.position = 'fixed';
    cloneObj.style.top = '0px';
    cloneObj.style.left = '0px';
    cloneObj.style.zIndex = '9999';
    cloneObj.style.pointerEvents = 'none';
    cloneObj.appendChild(this.ghostElement);
    cloneObj.style.transform = 'translate3d( ' + left + 'px ,' + top + 'px,0);';
    this.cloneObj = cloneObj;
    document.body.appendChild(cloneObj);
  }
}

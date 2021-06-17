import { Movable, MovableParams, IPosition } from '../Movable';
import { ViewData } from '@/class/ViewData';

export class ShadowMovable extends Movable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  constructor(params: MovableParams) {
    super({
      ...params,
    });
    document.addEventListener('mouseup', () => {
      this.clearShadowElement();
    });

    this.init();
  }
  override init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  override  updateElementStyle(positon: IPosition) {
    this.updateViewData(positon);
    const element = this.element;
    this.movePosition = positon;
    element.style.transform = `translate3d(${positon.x + this.translateX}px, ${
      positon.y + this.translateY
    }px, 0)`;
  }
  updateViewData(positon: IPosition) {
    if (!this.viewData) return;
    this.viewData.editableConfigurators?.x?.setValue(positon.x);
    this.viewData.editableConfigurators?.y?.setValue(positon.y);
  }
  setShadowElement(node: HTMLElement) {
    this.shadowElement = node;
    this.viewData = ViewData.collection.getViewDataByElement(node);
    this.container = node.offsetParent as HTMLElement;
    this.initElementTranslate(this.container);
    this.initElementByShadow(this.viewData);
  }
  attachMouseDownEvent(e: MouseEvent) {
    this.handleMouseDown(e);
  }
  private initElementByShadow(viewData: ViewData | null) {
    const positon = {
      x: (viewData?.editableConfigurators.x?.value || 0) as number,
      y: (viewData?.editableConfigurators.y?.value || 0) as number,
    };
    this.updateElementStyle(positon);
  }
  private initElementTranslate(container: HTMLElement) {
    const offRect = this.offsetParent.getBoundingClientRect();
    const conRect = container.getBoundingClientRect();
    this.translateX = conRect.x - offRect.x;
    this.translateY = conRect.y - offRect.y;
  }
  private clearShadowElement() {
    if (this.shadowElement)
      this.shadowElement.removeEventListener('mousedown', this.handleMouseDown);
  }
}

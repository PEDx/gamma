import { Movable, MovableParams, IPosition } from './Movable';
import { ViewData } from '@/class/ViewData/ViewData';

export class ShadowMovable extends Movable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  disableXMove: boolean = false;
  disableYMove: boolean = false;
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
  override  updata(positon: IPosition) {
    if (this.disableXMove) positon.x = 0
    if (this.disableYMove) positon.y = 0
    this.updateConfiguratior(positon);
    this.updateElementStyle(positon);
  }
  updateConfiguratior(positon: IPosition) {
    if (!this.viewData) return;
    this.viewData.editableConfigurators.x?.setValue(positon.x);
    this.viewData.editableConfigurators.y?.setValue(positon.y);
  }
  setShadowElement(node: HTMLElement) {
    this.shadowElement = node;
    this.viewData = ViewData.collection.getViewDataByElement(node);
    this.container = node.offsetParent;
    if(!this.container) return
    this.initElementTranslate(this.container);
    this.initElementByShadow(this.viewData);
  }
  attachMouseDownEvent(e: MouseEvent) {
    if(!this.container) return
    this.handleMouseDown(e);
  }
  private initElementByShadow(viewData: ViewData | null) {
    const positon = {
      x: (viewData?.editableConfigurators.x?.value || 0) as number,
      y: (viewData?.editableConfigurators.y?.value || 0) as number,
    };
    this.disableXMove = !(viewData?.editableConfigurators.x)
    this.disableYMove = !(viewData?.editableConfigurators.y)
    this.updateElementStyle(positon);
  }
  private initElementTranslate(container: Element) {
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

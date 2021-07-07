import { Movable, MovableParams, IPosition } from './Movable';
import { ViewData } from '@/class/ViewData/ViewData';
import { ConcreteObserver } from '@/class/Observer';
import { Configurator } from '@/class/Configurator';
import { IRect } from './Editable';

export class ShadowMovable extends Movable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  disableXMove: boolean = false;
  disableYMove: boolean = false;
  updataRectObserver: ConcreteObserver<Configurator<IRect>>;
  constructor(params: MovableParams) {
    super({
      ...params,
    });

    this.updataRectObserver = new ConcreteObserver<Configurator<IRect>>(
      ({ value: { x, y } }) => {
        this.updateElementStyle({
          x, y
        })
      }
    );
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
    const rect = this.viewData!.configurators?.rect?.value
    if(!rect) return
    this.viewData!.configurators?.rect.setValue({ ...rect, ...positon });
  }
  setShadowElement(viewData: ViewData) {
    if (!viewData) throw new Error('can not set shadowViewData');
    if (this.viewData) {
      this.viewData!.configurators.rect?.detach(
        this.updataRectObserver,
      );
    }

    viewData.configurators.rect?.attach(this.updataRectObserver);
    this.shadowElement = viewData.element;
    this.viewData = viewData;
    this.container = this.shadowElement.offsetParent;
    if (!this.container) return
    this.initElementTranslate(this.container);
    this.initElementByShadow(this.viewData);
  }
  attachMouseDownEvent(e: MouseEvent) {
    if (!this.container) return
    this.handleMouseDown(e);
  }
  private initElementByShadow(viewData: ViewData | null) {
    const { x = 0, y = 0 } = viewData?.configurators?.rect?.value || {}
    const positon = {
      x: x as number,
      y: y as number,
    };
    this.updateElementStyle(positon);
  }
  private initElementTranslate(container: Element) {
    const offRect = this.offsetParent.getBoundingClientRect();
    const conRect = container.getBoundingClientRect();
    this.translateX = conRect.x - offRect.x + this.shadowElement.offsetLeft; // 盒子内部可能会有边距，因此需加上  offset
    this.translateY = conRect.y - offRect.y + this.shadowElement.offsetTop
  }
}

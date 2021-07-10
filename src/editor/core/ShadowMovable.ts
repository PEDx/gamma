import { Movable, MovableParams, IPosition } from './Movable';
import { ViewData } from '@/runtime/ViewData';
import { ConcreteObserver } from '@/commom/Observer';
import { Configurator } from '@/runtime/Configurator';

export class ShadowMovable extends Movable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  disableXMove: boolean = false;
  disableYMove: boolean = false;
  updateXObserver: ConcreteObserver<Configurator<number>>;
  updateYObserver: ConcreteObserver<Configurator<number>>;
  constructor(params: MovableParams) {
    super({
      ...params,
    });

    this.updateXObserver = new ConcreteObserver<Configurator<number>>(({ value }) => {
      this.updateElementStyle({
        x: value,
        y: this.newPosition.y
      });
    });
    this.updateYObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => {
        this.updateElementStyle({
          x: this.newPosition.x,
          y: value,
        });
      },
    );
    this.init();
  }
  override init() {
    document.addEventListener('mousemove', this.mousemoveHandler);
    document.addEventListener('mouseup', this.mouseupHandler);
  }
  override  update(positon: IPosition) {
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
  setShadowElement(viewData: ViewData) {
    if (!viewData) throw new Error('can not set shadowViewData');
    if (this.viewData) {
      this.viewData.editableConfigurators.x?.detach(
        this.updateXObserver,
      );
      this.viewData.editableConfigurators.y?.detach(
        this.updateYObserver,
      );
    }
    viewData.editableConfigurators.x?.attach(this.updateXObserver);
    viewData.editableConfigurators.y?.attach(
      this.updateYObserver,
    );
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
    this.translateX = conRect.x - offRect.x + this.shadowElement.offsetLeft; // 盒子内部可能会有边距，因此需加上  offset
    this.translateY = conRect.y - offRect.y + this.shadowElement.offsetTop
  }
}

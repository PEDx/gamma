import { Editable, IEditable, editableConfiguratorType, IRect } from './Editable';
import { ShadowMovable } from './ShadowMovable';
import { Configurator } from '@/class/Configurator';
import { ViewData } from '@/class/ViewData/ViewData';
import { ConcreteObserver } from '@/class/Observer';

export class ShadowEditable extends Editable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  disableWidth: boolean = false;
  disableHeight: boolean = false;
  override movable: ShadowMovable;
  updataRectObserver: ConcreteObserver<Configurator<IRect>>;
  constructor({ element, container, distance, effect }: IEditable) {
    super({
      element,
      container,
      distance,
      effect
    });

    this.movable = new ShadowMovable({
      element: element,
      container: container,
      distance: distance,
      effect: this._effect,
    });

    this.updataRectObserver = new ConcreteObserver<Configurator<IRect>>(
      ({ value: { width, height } }) => {
        this.updateElementStyle('width', width)
        this.updateElementStyle('height', height)
      }
    );
  }
  private updateConfiguratior(key: editableConfiguratorType, value: number) {
    const rect = this.viewData!.configurators?.rect.value
    this.viewData!.configurators?.rect.setValue({ ...rect, [key]: value });
  }
  override updata(key: editableConfiguratorType, value: number) {
    this.updateConfiguratior(key, value);
    this.updateElementStyle(key, value);
  }
  private initElementByShadow() {
    const shadowElement = this.shadowElement;
    this.container = shadowElement.offsetParent as HTMLElement;
    const width = shadowElement.clientWidth
    const height = shadowElement.clientHeight
    this.updateElementStyle('width', shadowElement.clientWidth);
    this.updateElementStyle('height', shadowElement.clientHeight);
    this.initRect(width, height);
  }

  attachMouseDownEvent(e: MouseEvent) {
    this.movable.attachMouseDownEvent(e);
  }
  setShadowViewData(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');
    if (this.viewData) {
      this.viewData!.configurators.rect?.detach(
        this.updataRectObserver,
      );
    }
    this.viewData = viewData;

    this.viewData.configurators.rect?.attach(this.updataRectObserver);

    this.shadowElement = viewData.element;
    this.movable.setShadowElement(viewData);
    this.initElementByShadow();
  }
}

import { Editable, IEditable, editableConfiguratorType } from './Editable';
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
  updataWidthObserver: ConcreteObserver<Configurator<unknown>>;
  updataHeightObserver: ConcreteObserver<Configurator<unknown>>;
  constructor({ element, container, distance }: IEditable) {
    super({
      element,
      container,
      distance,
    });

    this.movable = new ShadowMovable({
      element: element,
      container: container,
      distance: distance,
    });

    this.updataWidthObserver = new ConcreteObserver<Configurator<unknown>>(({ value }) =>
      this.updateElementStyle('width', value as number),
    );
    this.updataHeightObserver = new ConcreteObserver<Configurator<unknown>>(
      ({ value }) => this.updateElementStyle('height', value as number),
    );
  }
  private updateConfiguratior(key: editableConfiguratorType, value: number) {
    this.viewData!.editableConfigurators[key]?.setValue(value);
  }
  override updata(key: editableConfiguratorType, value: number) {
    if (key === 'width' && this.disableWidth) return;
    if (key === 'height' && this.disableHeight) return;
    this.updateConfiguratior(key, value);
    this.updateElementStyle(key, value);
  }
  private initElementByShadow() {
    const shadowElement = this.shadowElement;
    this.container = shadowElement.offsetParent as HTMLElement;
    this.updateElementStyle('width', shadowElement.clientWidth);
    this.updateElementStyle('height', shadowElement.clientHeight);
  }

  attachMouseDownEvent(e: MouseEvent) {
    this.movable.attachMouseDownEvent(e);
  }
  setShadowViewData(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');
    if (this.viewData) {
      this.viewData!.editableConfigurators.width?.detach(
        this.updataWidthObserver,
      );
      this.viewData!.editableConfigurators.height?.detach(
        this.updataHeightObserver,
      );
    }
    this.viewData = viewData;

    this.disableWidth = !viewData?.editableConfigurators.width;
    this.disableHeight = !viewData?.editableConfigurators.height;

    this.viewData.editableConfigurators.width?.attach(this.updataWidthObserver);
    this.viewData!.editableConfigurators.height?.attach(
      this.updataHeightObserver,
    );

    this.shadowElement = viewData.element;
    this.movable.setShadowElement(viewData);
    this.initElementByShadow();
  }
}

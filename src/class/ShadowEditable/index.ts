import { Editable, IEditable, editableConfiguratorType } from '../Editable';
import { ShadowMovable } from '../ShadowMovable';
import { Configurator } from '@/class/Configurator';
import { ViewData } from '@/class/ViewData';
import { ConcreteObserver } from '@/class/Observer';

export class ShadowEditable extends Editable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  override movable: ShadowMovable;
  updataWidthObserver: ConcreteObserver<Configurator>;
  updataHeightObserver: ConcreteObserver<Configurator>;
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

    this.updataWidthObserver = new ConcreteObserver<Configurator>(
      ({ value }) => this.updateElementStyle('width', value as number),
    );
    this.updataHeightObserver = new ConcreteObserver<Configurator>(
      ({ value }) => this.updateElementStyle('height', value as number),
    );
  }
  private updateConfiguratior(key: editableConfiguratorType, value: number) {
    this.viewData!.editableConfigurators[key]!.setValue(value);
  }
  override updata(key: editableConfiguratorType, value: number) {
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
    if (this.viewData) {
      this.viewData!.editableConfigurators.width?.detach(
        this.updataWidthObserver,
      );
      this.viewData!.editableConfigurators.height?.detach(
        this.updataHeightObserver,
      );
    }
    if (!viewData) throw new Error('can not set shadowViewData');
    this.viewData = viewData;

    this.viewData!.editableConfigurators.width?.attach(
      this.updataWidthObserver,
    );
    this.viewData!.editableConfigurators.height?.attach(
      this.updataHeightObserver,
    );

    this.shadowElement = viewData.element;
    this.movable.setShadowElement(this.shadowElement);
    this.initElementByShadow();
  }
}

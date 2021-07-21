import { Editable, IEditable, editableConfiguratorType } from './Editable';
import { ShadowMovable } from './ShadowMovable';
import { Configurator } from '@/runtime/Configurator';
import { ViewData } from '@/runtime/ViewData';
import { ConcreteObserver } from '@/common/Observer';

export class ShadowEditable extends Editable {
  shadowElement!: HTMLElement;
  viewData!: ViewData | null;
  disableWidth: boolean = false;
  disableHeight: boolean = false;
  override movable: ShadowMovable;
  updateWidthObserver: ConcreteObserver<Configurator<number>>;
  updateHeightObserver: ConcreteObserver<Configurator<number>>;
  constructor({ editableElement, distance, effect }: IEditable) {
    super({
      editableElement,
      distance,
      effect,
    });
    this.movable = new ShadowMovable({
      editableElement,
      distance: distance,
      effect: this._effect,
    });
    this.updateWidthObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => this.editableElement.update('width', value),
    );
    this.updateHeightObserver = new ConcreteObserver<Configurator<number>>(
      ({ value }) => this.editableElement.update('height', value),
    );
  }
  private updateShadowViewDataConfiguratior(
    key: editableConfiguratorType,
    value: number,
  ) {
    this.viewData!.editableConfigurators[key]?.setValue(value);
  }
  override update(key: editableConfiguratorType, value: number) {
    if (key === 'width' && this.disableWidth) return;
    if (key === 'height' && this.disableHeight) return;
    this.updateShadowViewDataConfiguratior(key, value);
    this.editableElement.update(key, value);
  }
  private initElementByShadow() {
    const shadowElement = this.shadowElement;
    this.container = shadowElement.offsetParent as HTMLElement;
    const width = shadowElement.clientWidth;
    const height = shadowElement.clientHeight;
    this.editableElement.update('width', width);
    this.editableElement.update('height', height);
  }
  attachMouseDownEvent(e: MouseEvent) {
    this.movable.attachMouseDownEvent(e);
  }
  /**
   * setShadowElement 必须比 attachMouseDownEvent 先调用
   * @param viewData
   * @returns
   */
  setShadowViewData(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');
    if (this.viewData) {
      this.viewData!.editableConfigurators.width?.detach(
        this.updateWidthObserver,
      );
      this.viewData!.editableConfigurators.height?.detach(
        this.updateHeightObserver,
      );
    }
    this.viewData = viewData;

    this.disableWidth = !viewData?.editableConfigurators.width;
    this.disableHeight = !viewData?.editableConfigurators.height;

    this.viewData.editableConfigurators.width?.attach(this.updateWidthObserver);
    this.viewData!.editableConfigurators.height?.attach(
      this.updateHeightObserver,
    );

    this.shadowElement = viewData.element;
    this.movable.setShadowElement(viewData);
    this.initElementByShadow();
  }
}

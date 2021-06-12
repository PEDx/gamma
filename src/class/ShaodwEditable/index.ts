import { Editable, IEditable, editableConfiguratorType } from '../Editable';
import { ShaodwMovable } from '../ShaodwMovable';
import { ViewData } from '@/class/ViewData';

export class ShaodwEditable extends Editable {
  override movable: ShaodwMovable
  constructor({ element, container, distance }: IEditable) {
    super({
      element,
      container,
      distance,
    });
    this.movable = new ShaodwMovable({
      element: element,
      container: container,
      distance: distance,
    });
  }
  private updateViewData(key: editableConfiguratorType, value: number) {
    this.viewData!.editableConfigurators[key]!.setValue(value);
  }
  override updateElementStyle(key: editableConfiguratorType, value: number) {
     this.updateViewData(key, value)
    const element = this.element;
    element.style.setProperty(key, `${value}px`);
  }
  private initElementByShadow() {
    const shadowElement = this.shadowElement;
    const element = this.element;
    this.container = shadowElement.offsetParent as HTMLElement;
    element.style.setProperty('width', `${shadowElement.clientWidth}px`);
    element.style.setProperty('height', `${shadowElement.clientHeight}px`);
  }

  attachMouseDownEvent(e: MouseEvent) {
    this.movable.attachMouseDownEvent(e);
  }
  setShadowViewData(viewData: ViewData | null) {
    if (!viewData) throw new Error('can not set shadowViewData');
    this.viewData = viewData;
    this.shadowElement = viewData.element;
    this.movable.setShadowElement(this.shadowElement);
    this.initElementByShadow();
  }
}

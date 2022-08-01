import { Observer, Subject } from '@gamma/runtime';
import { IEditableElement } from './Editable/EditableElement';
import { Editor } from './Editor';
import { logger } from './Logger';

export class Selector extends Subject {
  private id: string | null = null;
  xConf: Editor.CPVE | null = null;
  yConf: Editor.CPVE | null = null;
  wConf: Editor.CPVE | null = null;
  hConf: Editor.CPVE | null = null;
  updateXObserver: Observer<Editor.CPVE> | null = null;
  updateYObserver: Observer<Editor.CPVE> | null = null;
  updateWObserver: Observer<Editor.CPVE> | null = null;
  updateHObserver: Observer<Editor.CPVE> | null = null;
  private timer: number = 0;
  select(id: string) {
    logger.debug(`active_id: ${id}`);

    const node = Editor.runtime.getViewNodeByID(id);

    if (!node) return;

    this.id = id;

    clearTimeout(this.timer);

    this.xConf?.detach(this.updateXObserver!);
    this.yConf?.detach(this.updateYObserver!);
    this.wConf?.detach(this.updateWObserver!);
    this.hConf?.detach(this.updateHObserver!);

    this.xConf = Editor.runtime.getTypeXConfigurator(node!);
    this.yConf = Editor.runtime.getTypeYConfigurator(node!);
    this.wConf = Editor.runtime.getTypeWConfigurator(node!);
    this.hConf = Editor.runtime.getTypeHConfigurator(node!);

    this.xConf?.attach(this.updateXObserver!);
    this.yConf?.attach(this.updateYObserver!);
    this.wConf?.attach(this.updateWObserver!);
    this.hConf?.attach(this.updateHObserver!);

    this.notify();
  }
  unselect() {
    this.timer = setTimeout(() => {
      this.id = null;
      this.notify();
    });
  }
  same(id: string) {
    if (id === this?.id) return true;
    return false;
  }
  isSelected() {
    return !!this.id;
  }
  getNodeConfigurators() {
    if (!this.id) return {};
    const node = Editor.runtime.getViewNodeByID(this.id);
    if (!node) return {};
    return node.configurators;
  }
  observerXY(element: IEditableElement) {
    this.updateXObserver = new Observer(({ value }) => {
      element.updateReact('x', value);
    });
    this.updateYObserver = new Observer(({ value }) => {
      element.updateReact('y', value);
    });
  }
  observerWH(element: IEditableElement) {
    this.updateWObserver = new Observer(({ value }) => {
      element.updateReact('width', value);
    });
    this.updateHObserver = new Observer(({ value }) => {
      element.updateReact('height', value);
    });
  }
  onSelect(fn?: (id: string | null) => void) {
    if (!fn) return;
    const obs = new Observer(() => fn(this.id));
    this.attach(obs);
  }
  removeSelf() {
    if (!this.id) return;
    Editor.runtime.removeViewNode(this.id);
  }
}

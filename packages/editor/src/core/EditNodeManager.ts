import {
  ConcreteObserver,
  Configurator,
  ElementNode,
  nodeHelper,
} from '@gamma/runtime';
import { PXNumberValueEntity } from '@gamma/runtime/src/values/UnitNumberValueEntity';
import { IEditableElement } from './EditableElement';

export class EditNodeManager {
  activeNode: ElementNode | null = null;
  xConf: Configurator<PXNumberValueEntity> | null = null;
  yConf: Configurator<PXNumberValueEntity> | null = null;
  wConf: Configurator<PXNumberValueEntity> | null = null;
  hConf: Configurator<PXNumberValueEntity> | null = null;
  updateXObserver: ConcreteObserver<Configurator<PXNumberValueEntity>> | null =
    null;
  updateYObserver: ConcreteObserver<Configurator<PXNumberValueEntity>> | null =
    null;
  updateWObserver: ConcreteObserver<Configurator<PXNumberValueEntity>> | null =
    null;
  updateHObserver: ConcreteObserver<Configurator<PXNumberValueEntity>> | null =
    null;
  active(node: ElementNode) {
    this.activeNode = node;

    if (this.updateXObserver) this.xConf?.detach(this.updateXObserver);
    if (this.updateYObserver) this.yConf?.detach(this.updateYObserver);
    if (this.updateWObserver) this.wConf?.detach(this.updateWObserver);
    if (this.updateHObserver) this.hConf?.detach(this.updateHObserver);

    this.xConf = nodeHelper.getTypeXConfigurator(this.activeNode!);
    this.yConf = nodeHelper.getTypeYConfigurator(this.activeNode!);
    this.wConf = nodeHelper.getTypeWConfigurator(this.activeNode!);
    this.hConf = nodeHelper.getTypeHConfigurator(this.activeNode!);

    if (this.updateXObserver) this.xConf?.attach(this.updateXObserver);
    if (this.updateYObserver) this.yConf?.attach(this.updateYObserver);
    if (this.updateWObserver) this.wConf?.attach(this.updateWObserver);
    if (this.updateHObserver) this.hConf?.attach(this.updateHObserver);
  }
  inactive() {
    this.activeNode = null;
  }
  same(node: ElementNode) {
    if (node.id === this.activeNode?.id) return true;
    return false;
  }
  observerXY(element: IEditableElement) {
    this.updateXObserver = new ConcreteObserver(({ value }) => {
      element.updateReact('x', value);
    });
    this.updateYObserver = new ConcreteObserver(({ value }) => {
      element.updateReact('y', value);
    });
  }
  observerWH(element: IEditableElement) {
    this.updateWObserver = new ConcreteObserver(({ value }) => {
      element.updateReact('width', value);
    });
    this.updateHObserver = new ConcreteObserver(({ value }) => {
      element.updateReact('height', value);
    });
  }
}

export const editNodeManager = new EditNodeManager();

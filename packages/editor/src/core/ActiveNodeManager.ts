import {
  ConcreteObserver,
  ConcreteSubject,
  Configurator,
  ElementNode,
  nodeHelper,
} from '@gamma/runtime';
import { PXNumberValueEntity } from '@gamma/runtime/src/values/UnitNumberValueEntity';
import { IEditableElement } from './EditableElement';
import { logger } from './Logger';

type TCPX = Configurator<PXNumberValueEntity>;

export class ActiveNodeManager extends ConcreteSubject {
  private node: ElementNode | null = null;
  xConf: TCPX | null = null;
  yConf: TCPX | null = null;
  wConf: TCPX | null = null;
  hConf: TCPX | null = null;
  updateXObserver: ConcreteObserver<TCPX> | null = null;
  updateYObserver: ConcreteObserver<TCPX> | null = null;
  updateWObserver: ConcreteObserver<TCPX> | null = null;
  updateHObserver: ConcreteObserver<TCPX> | null = null;
  active(node: ElementNode) {
    logger.info(`active node id: ${node.id}`);
    this.node = node;
    this.notify();

    this.xConf?.detach(this.updateXObserver!);
    this.yConf?.detach(this.updateYObserver!);
    this.wConf?.detach(this.updateWObserver!);
    this.hConf?.detach(this.updateHObserver!);

    this.xConf = nodeHelper.getTypeXConfigurator(this.node!);
    this.yConf = nodeHelper.getTypeYConfigurator(this.node!);
    this.wConf = nodeHelper.getTypeWConfigurator(this.node!);
    this.hConf = nodeHelper.getTypeHConfigurator(this.node!);

    this.xConf?.attach(this.updateXObserver!);
    this.yConf?.attach(this.updateYObserver!);
    this.wConf?.attach(this.updateWObserver!);
    this.hConf?.attach(this.updateHObserver!);
  }
  inactive() {
    this.node = null;
    setTimeout(() => {
      this.notify();
    });
  }
  same(node: ElementNode) {
    if (node.id === this.node?.id) return true;
    return false;
  }
  isActive() {
    return !!this.node;
  }
  getNodeConfigurators() {
    if (!this.node) return {};
    return this.node.configurators;
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
  onActive(fn?: () => void) {
    if (!fn) return;
    const obs = new ConcreteObserver(() => fn());
    this.attach(obs);
  }
}

export const activeNodeManager = new ActiveNodeManager();

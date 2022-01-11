import {
  ConcreteObserver,
  ConcreteSubject,
  Configurator,
  ViewNode,
  nodeHelper,
  PXNumberValueEntity,
} from '@gamma/runtime';
import { IEditableElement } from './EditableElement';
import { logger } from './Logger';

type CPVE = Configurator<PXNumberValueEntity>;

export class ActiveNodeManager extends ConcreteSubject {
  private node: ViewNode | null = null;
  xConf: CPVE | null = null;
  yConf: CPVE | null = null;
  wConf: CPVE | null = null;
  hConf: CPVE | null = null;
  updateXObserver: ConcreteObserver<CPVE> | null = null;
  updateYObserver: ConcreteObserver<CPVE> | null = null;
  updateWObserver: ConcreteObserver<CPVE> | null = null;
  updateHObserver: ConcreteObserver<CPVE> | null = null;
  private timer: number = 0;
  active(node: ViewNode) {
    logger.info(`active node id: ${node.id}`);
    this.node = node;
    clearTimeout(this.timer);
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
    this.timer = setTimeout(() => {
      this.node = null;
      this.notify();
    });
  }
  same(node: ViewNode) {
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

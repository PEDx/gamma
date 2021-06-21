import { Configurator } from '@/class/Configurator';
import { ConfiguratorMap } from '@/packages';
import { throttle } from 'lodash';

export class ConfiguratorUnion {
  configurators: ConfiguratorMap;
  constructor(configurators: ConfiguratorMap) {
    this.configurators = configurators;
    this.init();
  }
  init() {
    const update = () => setTimeout(() => this._update());
  }
  _update = () => {};
}

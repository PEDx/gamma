import { NumberInput } from '@/configurator/NumberInput';
import {
  Observer,
  Configurator,
  EConfiguratorType,
} from '@gamma/runtime';
import { ValueEntity } from '@gamma/runtime/src/values/ValueEntity';
import { FC } from 'react';

export const configuratorComponentMap = new Map<EConfiguratorType, FC<any>>([
  [EConfiguratorType.Width, NumberInput],
]);

export class ConfiguratorComponent<T> {
  conf: Configurator<ValueEntity<T>>;
  constructor(conf: Configurator<ValueEntity<T>>) {
    this.conf = conf;
    this.conf.attach(
      new Observer(() => {
        console.log(this.conf.value);
      }),
    );
  }
  render() {}
}

export class ConfiguratorManager {
  constructor() {}
}

export const computeKey = (type: EConfiguratorType) => {
  const cache: { [key in EConfiguratorType]?: number } = {};
  let cnt = cache[type];
  if (!cnt) {
    cnt = 0;
    cnt += 1;
    cache[type] = cnt;
  }
  return `${type}-${cnt}`;
};

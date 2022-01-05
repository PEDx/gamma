import { EConfiguratorType } from '@gamma/runtime';
import { NumberInput } from './NumberInput';

export const configuratorComponentMap = new Map<EConfiguratorType, any>([
  [EConfiguratorType.Width, NumberInput],
  [EConfiguratorType.Height, NumberInput],
  [EConfiguratorType.X, NumberInput],
  [EConfiguratorType.Y, NumberInput],
]);

export function getConfiguratorComponet(type: EConfiguratorType) {
  const _comp = configuratorComponentMap.get(type);
  if (!_comp) throw 'can not find configurator component';
  return configuratorComponentMap.get(type);
}

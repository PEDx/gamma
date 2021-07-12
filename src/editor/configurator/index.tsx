import {
  ConfiguratorComponentType,
  ConfiguratorValueType,
} from '@/runtime/Configurator';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';
import { DropArea } from './DropArea';
import { FontConfig } from './FontConfig';
import { TextInput } from './TextInput';
import { RectConfig } from './RectConfig';
import { Switch } from './Switch';
import { Select } from './Select';

export const configuratorComponentMap = new Map<
  ConfiguratorValueType,
  ConfiguratorComponentType<any>
>([
  [ConfiguratorValueType.Text, TextInput],
  [ConfiguratorValueType.Number, NumberInput],
  [ConfiguratorValueType.Width, NumberInput],
  [ConfiguratorValueType.Height, NumberInput],
  [ConfiguratorValueType.X, NumberInput],
  [ConfiguratorValueType.Y, NumberInput],
  [ConfiguratorValueType.Resource, DropArea],
  [ConfiguratorValueType.Font, FontConfig],
  [ConfiguratorValueType.Color, ColorPicker],
  [ConfiguratorValueType.Rect, RectConfig],
  [ConfiguratorValueType.Boolean, Switch],
  [ConfiguratorValueType.Select, Select],
]);

export function getConfiguratorComponet(type: ConfiguratorValueType) {
  const _comp = configuratorComponentMap.get(type);
  if (!_comp) throw 'can not find configurator component';
  return configuratorComponentMap.get(type);
}

import {
  ConfiguratorComponentType,
  ConfiguratorValueType,
} from '@gamma/runtime';
import { NumberInput } from './NumberInput';
import { ColorPicker } from './ColorPicker';
import { DropArea } from './DropArea';
import { FontConfig } from './FontConfig';
import { BorderConfig } from './BorderConfig';
import { TextInput } from './TextInput';
import { RichTextEditor } from './RichTextEditor';
import { TextAreaInput } from './TextAreaInput';
import { ScriptDropArea } from './ScriptDropArea';
import { NodeDropArea } from './NodeDropArea';
import { Switch } from './Switch';
import { Select } from './Select';

export const configuratorComponentMap = new Map<
  ConfiguratorValueType,
  ConfiguratorComponentType<any>
>([
  [ConfiguratorValueType.TextArea, TextAreaInput],
  [ConfiguratorValueType.Text, TextInput],
  [ConfiguratorValueType.RichText, RichTextEditor],
  [ConfiguratorValueType.Number, NumberInput],
  [ConfiguratorValueType.Width, NumberInput],
  [ConfiguratorValueType.Height, NumberInput],
  [ConfiguratorValueType.X, NumberInput],
  [ConfiguratorValueType.Y, NumberInput],
  [ConfiguratorValueType.ContainerCount, NumberInput],
  [ConfiguratorValueType.Resource, DropArea],
  [ConfiguratorValueType.Script, ScriptDropArea],
  [ConfiguratorValueType.Node, NodeDropArea],
  [ConfiguratorValueType.Font, FontConfig],
  [ConfiguratorValueType.Border, BorderConfig],
  [ConfiguratorValueType.Color, ColorPicker],
  [ConfiguratorValueType.Boolean, Switch],
  [ConfiguratorValueType.Select, Select],
]);

export function getConfiguratorComponet(type: ConfiguratorValueType) {
  const _comp = configuratorComponentMap.get(type);
  if (!_comp) throw 'can not find configurator component';
  return configuratorComponentMap.get(type);
}

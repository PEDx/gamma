import { IdleComponentWrap } from '@/components/IdleComponent';
import { useForceRender } from '@/hooks/useForceRender';
import {
  ConcreteObserver,
  EConfiguratorType,
  TConfigurator,
} from '@gamma/runtime';
import { useEffect } from 'react';
import { NumberInput } from './NumberInput';
import { TextInput } from './TextInput';

export interface IConfiguratorComponentProps<T> {
  value: T;
}

export const ConfiguratorViewTypeMap: {
  [key in EConfiguratorType]?: (
    props: IConfiguratorComponentProps<any>,
  ) => JSX.Element;
} = {
  [EConfiguratorType.Width]: NumberInput,
  [EConfiguratorType.Height]: NumberInput,
  [EConfiguratorType.X]: NumberInput,
  [EConfiguratorType.Y]: NumberInput,
  [EConfiguratorType.Number]: NumberInput,
  [EConfiguratorType.Font]: TextInput,
  [EConfiguratorType.Background]: TextInput,
  [EConfiguratorType.Border]: TextInput,
  [EConfiguratorType.Text]: TextInput,
  [EConfiguratorType.Switch]: TextInput,
};

export const ConfiguratorView = ({
  configurator,
}: {
  configurator: TConfigurator;
}) => {
  const render = useForceRender();

  useEffect(() => {
    const observer = new ConcreteObserver(render);
    configurator.attach(observer);
    return () => {
      configurator.detach(observer);
    };
  }, [configurator]);

  if (!configurator.lable) return null; // 无 lable 属性不显示组件

  const type = configurator.type;
  const value = configurator.value;

  const View = ConfiguratorViewTypeMap[type];

  if (!View) return null; // 未找到对应配置器视图

  return (
    <IdleComponentWrap>
      <View value={value} />
    </IdleComponentWrap>
  );
};

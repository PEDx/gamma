import ReactDOM from 'react-dom';
import { useState, FC, useEffect } from 'react';
import { createBaseView } from '../BaseView';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/runtime/Configurator';
import { createConfiguratorGroup } from '@/runtime/ConfiguratorGroup';
import { CreationView, WidgetType } from '@/runtime/CreationView';

// TODO 支持 Vue 组件 (引入 vue 后导致 global JSX.Element 冲突)

const meta = {
  id: 'gamma-react-widget',
  name: '空盒子',
  icon: '',
  type: WidgetType.React,
};
interface ReactViewProps {
  text: string;
  num: number;
}

const ReactView: FC<ReactViewProps> = ({ text, num }) => {
  const [count, setCount] = useState(0);
  console.log('ReactView: render');
  useEffect(() => {
    console.log('ReactView: first render');
  }, []);
  return (
    <div>
      <p>
        You clicked {count} times {num}
      </p>
      <button onClick={() => setCount(count + 1)}>Click me {text}</button>
    </div>
  );
};

export function createReactView(): CreationView {
  const { element: outElement, configurators } = createBaseView();

  const text = createConfigurator({
    type: ConfiguratorValueType.Text,
    lable: '文字',
    value: 'hello world',
  }).attachEffect();

  const num = createConfigurator({
    type: ConfiguratorValueType.Number,
    lable: '数字',
    value: 1,
  }).attachEffect();

  createConfiguratorGroup({ text, num }).attachEffect(({ text, num }) => {
    ReactDOM.render(<ReactView text={text} num={num} />, outElement);
  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, num },
  };
}

import ReactDOM from 'react-dom';
import { useState, FC, useEffect } from 'react';
import { createBaseView } from '../BaseView';
import {
  ConfiguratorValueType,
  createConfigurator,
} from '@/class/Configurator';
import { createConfiguratorGroup } from '@/class/ConfiguratorGroup';
import { CreationView } from '@/packages';
import { WidgetType } from '@/class/Widget';

// TODO 支持 Vue 组件 (引入 vue 后导致 global JSX.Element 冲突)

/**TODO
 * 序列化后，不同于普通以 dom 为基础的组件，可根据保存的 dom 结构和 viewdata 数据直接复
 * 原出原组件
 * 配置数据  + dom 结构 =()=> 组件视图
 * react 有自己的组件系统，需要
 * 配置数据  + react组件 =(react 实例化)=> 组件视图
 */

const meta = {
  id: 'gamma-react-widget',
  name: '空盒子',
  icon: '',
  type: WidgetType.React,
};

// React 组件内部不能直接通过 DOM 操作插入编辑元素，因为 React 组件本身
// 重渲染后会导致内部不在 React ‘作用域’内的元素丢失。
// 除非额外实现内部元素的存储

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
    ReactDOM.render(
      <ReactView text={text as string} num={num as number} />,
      outElement,
    );
  });

  return {
    meta,
    element: outElement,
    configurators: { ...configurators, text, num },
  };
}

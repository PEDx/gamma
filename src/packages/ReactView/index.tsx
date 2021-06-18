import ReactDOM from 'react-dom';
import { useState } from 'react';
import { createBaseView } from '../BaseView';
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
  id: 'gamma-react-demo-widget',
  name: '空盒子',
  icon: '',
  type: WidgetType.React,
};

export function ReactView() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export function createReactView(): CreationView {
  const { element: outElement, configurators } = createBaseView();
  ReactDOM.render(<ReactView />, outElement);
  return {
    meta,
    element: outElement,
    configurators: configurators,
  };
}

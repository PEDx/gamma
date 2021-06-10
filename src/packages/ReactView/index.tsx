import ReactDOM from 'react-dom';
import { useState } from 'react';
import { createBaseView } from '../BaseView';
import { CreationView } from '@/packages';

// TODO 支持 Vue 组件 (引入 vue 后导致 global JSX.Element 冲突)

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
  const [outElement, configurators] = createBaseView();
  ReactDOM.render(<ReactView />, outElement);
  return [outElement, [...configurators]];
}

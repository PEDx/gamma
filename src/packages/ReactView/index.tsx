import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createBaseView } from '../BaseView';
import { CreationView } from '@/packages';

// TODO 支持 Vue 组件 (引入 vue 后导致 global JSX.Element 冲突)

export function ReactView() {
  useEffect(() => {
    console.log('hello react');
  }, []);
  return <>React View</>;
}

export function createReactView(): CreationView {
  const [outElement, configurators] = createBaseView();
  ReactDOM.render(<ReactView />, outElement);
  return [outElement, [...configurators]];
}

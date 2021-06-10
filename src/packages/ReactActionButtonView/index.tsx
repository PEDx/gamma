import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createBaseView } from '../BaseView';
import { ICreateView } from '@/packages';

export function ReactActionButtonView() {
  useEffect(() => {
    console.log('hello react');
  }, []);
  return <>React View</>;
}

export function createReactActionButtonView(): ICreateView {
  const [outElement, configurators] = createBaseView();
  ReactDOM.render(<ReactActionButtonView />, outElement);
  return [outElement, [...configurators]];
}

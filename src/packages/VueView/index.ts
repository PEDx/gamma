import { createApp } from 'vue';
import { createBaseView } from '../BaseView';
import { CreationView } from '@/packages';
import View from './view.vue';

export function createVueView(): CreationView {
  const [outElement, configurators] = createBaseView();
  createApp(View).mount(outElement);
  return [outElement, [...configurators]];
}

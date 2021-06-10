import { ConcreteObserver } from '@/class/Observer';
import { ConfiguratorValueType, Configurator } from '@/class/Configurator';
import { CreationView } from '@/packages';
import { createBaseView } from '../BaseView';

export function createTextView(): CreationView {
  const [outElement, configurators] = createBaseView();
  const element = document.createElement('SPAN') as HTMLSpanElement;
  element.style.setProperty('color', `#f3f`);

  outElement.appendChild(element);

  const text = new Configurator({
    type: ConfiguratorValueType.Text,
    name: 'text',
    lable: '文字',
    value: 'hello world',
  });

  text.attach(
    new ConcreteObserver<Configurator>(({ value }) => {
      element.textContent = value as string;
    }),
  );
  return [outElement, [...configurators, text]];
}

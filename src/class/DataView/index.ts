import { getRandomStr } from '@/utils';
import { StyleSetter, StyleValue, StyleItem } from '../StyleSetter';
import { DraggerSetter } from '../DraggerSetter';
import { ConfiguratorSetter } from '../ConfiguratorSetter';

export type Setter = StyleSetter | DraggerSetter | ConfiguratorSetter;
interface SetterMap {
  [key: string]: Setter;
}

export class DataView {
  id: string;
  el: HTMLElement;
  data: Setter[];
  dataMap: SetterMap;
  onValueChange: (s: Setter) => void;
  constructor(
    element: HTMLElement,
    setters: Setter[],
    onValueChange: (s: Setter) => void,
  ) {
    this.id = `sv_${getRandomStr(10)}`;
    this.el = element;
    this.onValueChange = onValueChange;
    this.dataMap = {};
    this.data = [new StyleSetter('cursor', ''), ...setters].map((s) => {
      this.dataMap[s.name] = s;
      return s;
    });
  }
  setValue(key: string, value: StyleValue) {
    const item = this.dataMap[key];
    item.setValue(value);
    if (this.onValueChange) this.onValueChange(item);
    if (item instanceof StyleItem) {
      item.setStyle(this.el, item.name, item.getValue().toString());
    }
  }
  getItemValueByKey(key: string) {
    const item = this.dataMap[key];
    return item.getValue().toString();
  }
}

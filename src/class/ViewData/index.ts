import { getRandomStr } from '@/utils';
import {
  Configurator,
  ConfiguratorValueType,
} from '@/prototype/Configurator';

interface IViewDataParams {
  element: HTMLElement;
  configurators: Configurator[] | null;
}
interface ViewDataMap {
  [key: string]: ViewData;
}

//
interface EditableConfigurators {
  width?: Configurator;
  height?: Configurator;
  x?: Configurator;
  y?: Configurator;
}
export class ViewData {
  static map: ViewDataMap = {};
  readonly element: HTMLElement;
  readonly id: string;
  readonly configurators: Configurator[] = [];
  readonly editableConfigurators: EditableConfigurators = {};
  constructor({ element, configurators }: IViewDataParams) {
    this.element = element;
    this.configurators = configurators || [];
    this.id = `view_data_${getRandomStr(10)}`;
    this.element.dataset.id = this.id;
    ViewData.map[this.id] = this;

    this.configurators.forEach((ctor) => {
      if (ctor.type === ConfiguratorValueType.X)
        this.editableConfigurators.x = ctor;
      if (ctor.type === ConfiguratorValueType.Y)
        this.editableConfigurators.y = ctor;
      if (ctor.type === ConfiguratorValueType.Width)
        this.editableConfigurators.width = ctor;
      if (ctor.type === ConfiguratorValueType.Height)
        this.editableConfigurators.height = ctor;
    });
  }
  static getViewDataById(id: string) {
    const ret = ViewData.map[id];
    if (!ret) return null;
    return ret;
  }
  static getViewDataByElement(node: HTMLElement) {
    const id = node.dataset.id || '';
    return ViewData.getViewDataById(id);
  }
  static isViewDataElement(node: HTMLElement | null) {
    if (!node) return false;
    return !!ViewData.getViewDataByElement(node);
  }
  static findViewData(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!ViewData.isViewDataElement(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node) return null;
    return ViewData.getViewDataByElement(_node);
  }
}

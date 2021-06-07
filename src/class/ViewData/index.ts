import { getRandomStr } from '@/utils';
import { Configurator, ConfiguratorValueType } from '@/prototype/Configurator';

interface IViewDataParams {
  element: HTMLElement;
  configurators: Configurator[] | null;
}
interface ViewDataMap {
  [key: string]: ViewData;
}
interface EditableConfigurators {
  width?: Configurator;
  height?: Configurator;
  x?: Configurator;
  y?: Configurator;
}

interface IViewStaticData {}

export class ViewDataCollection {
  static map: ViewDataMap = {};
  static getViewDataById(id: string) {
    const ret = ViewDataCollection.map[id];
    if (!ret) return null;
    return ret;
  }
  static addViewData(vd: ViewData) {
    const _vd = ViewDataCollection.map[vd.id];
    if (_vd) return;
    ViewDataCollection.map[vd.id] = vd;
  }
  static removeViewData(vd: ViewData) {
    const _vd = ViewDataCollection.map[vd.id];
    if (!_vd) return;
    delete ViewDataCollection.map[vd.id];
  }
  static getViewDataByElement(node: HTMLElement) {
    const id = node.dataset.id || '';
    return ViewDataCollection.getViewDataById(id);
  }
  static isViewDataElement(node: HTMLElement | null) {
    if (!node) return false;
    return !!ViewDataCollection.getViewDataByElement(node);
  }
  static findViewData(node: HTMLElement) {
    let _node: HTMLElement | null = node;
    while (!ViewDataCollection.isViewDataElement(_node) && _node) {
      _node = _node?.parentElement;
    }
    if (!_node) return null;
    return ViewDataCollection.getViewDataByElement(_node);
  }
}

export class ViewData extends ViewDataCollection {
  readonly element: HTMLElement;
  readonly id: string;
  readonly configurators: Configurator[] = [];
  readonly editableConfigurators: EditableConfigurators = {};
  constructor({ element, configurators }: IViewDataParams) {
    super();
    this.element = element;
    this.configurators = configurators || [];
    this.id = `view_data_${getRandomStr(10)}`;
    this.element.dataset.id = this.id;
    ViewData.addViewData(this);
    this._initEditableConfigurators();
  }
  initViewByConfigurators() {
    this.configurators.forEach((configurator) => configurator.initValue());
  }
  // 初始化可拖拽编辑的配置器;
  private _initEditableConfigurators() {
    for (let index = 0; index < this.configurators.length; index++) {
      const configurator = this.configurators[index];
      if (configurator.type === ConfiguratorValueType.X) {
        this.editableConfigurators.x = configurator;
        continue;
      }
      if (configurator.type === ConfiguratorValueType.Y) {
        this.editableConfigurators.y = configurator;
        continue;
      }
      if (configurator.type === ConfiguratorValueType.Width) {
        this.editableConfigurators.width = configurator;
        continue;
      }
      if (configurator.type === ConfiguratorValueType.Height) {
        this.editableConfigurators.height = configurator;
        continue;
      }
    }
  }
  // 返回静态数据，用来生成构建任务
  getStaticData(): IViewStaticData {
    return {};
  }
}

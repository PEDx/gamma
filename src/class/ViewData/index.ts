import { getRandomStr } from '@/utils';
import { Configurator, ConfiguratorValueType } from '@/class/Configurator';
import { ViewDataCollection } from './ViewDataCollection';

export interface IViewDataParams {
  element: HTMLElement;
  configurators: Configurator[] | null;
}
interface EditableConfigurators {
  width?: Configurator;
  height?: Configurator;
  x?: Configurator;
  y?: Configurator;
}

interface IViewStaticData {}

export class ViewData extends ViewDataCollection {
  static collection = new ViewDataCollection();
  readonly element: HTMLElement;
  private parentElement: Element | null;
  readonly id: string;
  readonly configurators: Configurator[] = [];
  readonly editableConfigurators: EditableConfigurators = {};
  constructor({ element, configurators }: IViewDataParams) {
    super();
    this.element = element;
    this.parentElement = null;
    this.configurators = configurators || [];
    this.id = `viewdata_${getRandomStr(10)}`;
    this.element.dataset.id = this.id;
    ViewData.collection.addItem(this);
    this._initEditableConfigurators();
  }
  initViewByConfigurators() {
    this.configurators.forEach((configurator) => configurator.initValue());
  }
  removeSelfFromParent() {
    ViewData.collection.removeItem(this);
    this.parentElement?.removeChild(this.element);
    this.parentElement = null;
  }
  insertSelfToParent(parent: Element) {
    this.parentElement = parent;
    this.parentElement?.appendChild(this.element);
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
  // 序列化数据，用来生成构建任务
  serializeData(): IViewStaticData {
    return {};
  }
}



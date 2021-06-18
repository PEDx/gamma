import { getRandomStr } from '@/utils';
import { Configurator, ConfiguratorValueType } from '@/class/Configurator';
import { ConfiguratorMap } from '@/packages';
import { ViewDataCollection } from './ViewDataCollection';
export interface IViewDataParams {
  element: HTMLElement;
  configurators: ConfiguratorMap | null;
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
  readonly configurators: ConfiguratorMap = {};
  readonly editableConfigurators: EditableConfigurators = {};
  constructor({ element, configurators }: IViewDataParams) {
    super();
    this.element = element;
    this.parentElement = null;
    this.configurators = configurators || {};
    this.id = `viewdata_${getRandomStr(10)}`;
    this.element.dataset.id = this.id;
    ViewData.collection.addItem(this);
    this._initEditableConfigurators();
  }
  initViewByConfigurators() {
    Object.keys(this.configurators).forEach((key) =>
      this.configurators[key].initValue(),
    );
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
    this.editableConfigurators.x = this.configurators?.x;
    this.editableConfigurators.y = this.configurators?.y;
    this.editableConfigurators.width = this.configurators?.width;
    this.editableConfigurators.height = this.configurators?.height;
  }
  serialize(): IViewStaticData {
    return {
      id: this.id,
      configurators: '',
    };
  }
}

import { getRandomStr } from '@/utils';
import { Configurator } from '@/class/Configurator';
import { ConfiguratorMap } from '@/packages';
import { ViewDataCollection } from './ViewDataCollection';
import { ViewDataContainer } from './ViewDataContainer';
import { WidgetMeta } from '@/class/Widget';
export interface IViewDataParams {
  element: HTMLElement;
  meta?: WidgetMeta;
  configurators: ConfiguratorMap | null;
  containerElements?: HTMLElement[];
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
  readonly id: string;
  readonly meta?: WidgetMeta;
  readonly element: HTMLElement; // 可插入到外部容器的元素
  readonly containers: ViewDataContainer[] = []; // 对外的容器元素
  private parentElement: Element | null = null;

  // V8 里的对象其实维护两个属性，会把数字放入线性的 elements 属性中，并按照顺序存放。
  // 会把非数字的属性放入 properties 中，不会排序。
  // 遍历属性时先 elements 而后在 properties。
  readonly configurators: ConfiguratorMap = {}; // 不保证声明顺序，但在此场景下可用
  readonly editableConfigurators: EditableConfigurators = {};

  constructor({
    meta,
    element,
    configurators,
    containerElements,
  }: IViewDataParams) {
    super();
    this.element = element;
    this.meta = meta;
    const _containers = containerElements ? containerElements : [element];
    this.configurators = configurators || {};
    this.id = `viewdata_${getRandomStr(10)}`;
    this.element.dataset.id = this.id;
    _containers.forEach((container) => {
      this.containers.push(new ViewDataContainer({ element: container }));
    });
    ViewData.collection.addItem(this);
    this._initEditableConfigurators();
  }
  initViewByConfigurators() {
    Object.keys(this.configurators).forEach((key) =>
      this.configurators[key].initValue(),
    );
  }
  removeSelfFromParent() {}
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

import { ConfiguratorMap } from './GammaElement';
import { Memento } from './Memento';
import { IElementMeta } from './GammaElement';
import { PickConfiguratorValueTypeMap } from './Configurator';
import { LayoutMode } from "./LayoutMode";

interface IViewDataSnapshotParams {
  meta: IElementMeta; // 元数据对象，记录 viewdata 的抽象数据
  isLayout: boolean; // 是否是布局组件
  isRoot: boolean; // 是否是根组件
  index: number; // 排序，一般由布局组件类型使用
  mode: LayoutMode; // 布局类型
  configurators: PickConfiguratorValueTypeMap<ConfiguratorMap>; // 配置数据
  containers: string[][]; // 组件内部容器
}

/**
 * 此为 viewData 的可序列化快照，可用来记录、回退状态等
 */
export class ViewDataSnapshot implements Memento {
  readonly meta: IElementMeta;
  readonly isLayout: boolean;
  readonly isRoot: boolean;
  readonly index: number = 0;
  readonly mode: LayoutMode = LayoutMode.LongPage;
  readonly configurators: PickConfiguratorValueTypeMap<ConfiguratorMap>;
  readonly containers: string[][];
  constructor({
    meta,
    isLayout,
    isRoot,
    index,
    mode,
    configurators,
    containers,
  }: IViewDataSnapshotParams) {
    this.meta = meta;
    this.isLayout = isLayout;
    this.isRoot = isRoot;
    this.index = index;
    this.mode = mode;
    this.configurators = configurators;
    this.containers = containers;
  }
}

import { IConfiguratorMap } from './GammaElement';
import { IElementMeta } from './GammaElement';
import { PickConfiguratorValueTypeMap } from './Configurator';
import { LayoutMode } from './types';
import { Memento } from './Originator';

export interface IRuntimeElementSnapshotMap {
  [key: string]: RuntimeElementSnapshot;
}

export interface IRuntimeElementSnapshotParams {
  meta: IElementMeta; // 元数据对象，记录 viewdata 的抽象数据
  configurators: PickConfiguratorValueTypeMap<IConfiguratorMap>; // 配置数据
}

export class RuntimeElementSnapshot implements Memento {
  readonly meta: IElementMeta;
  readonly configurators: PickConfiguratorValueTypeMap<IConfiguratorMap>;
  constructor({ meta, configurators }: IRuntimeElementSnapshotParams) {
    this.meta = meta;
    this.configurators = configurators;
  }
}

type IViewDataSnapshotParams = IRuntimeElementSnapshotParams & {
  containers: string[][];
};
export class ViewDataSnapshot extends RuntimeElementSnapshot {
  readonly containers: string[][];
  constructor({ meta, configurators, containers }: IViewDataSnapshotParams) {
    super({ meta, configurators });
    this.containers = containers;
  }
}
export class RootViewDataSnapshot extends ViewDataSnapshot {
  readonly isRoot: boolean = true;
  readonly mode: LayoutMode;
  constructor({
    meta,
    configurators,
    containers,
    mode,
  }: IViewDataSnapshotParams & { mode: LayoutMode }) {
    super({ meta, configurators, containers });
    this.mode = mode;
  }
}

export class LayoutViewDataSnapshot extends ViewDataSnapshot {
  readonly isLayout: boolean = true;
  readonly index: number;
  constructor({
    meta,
    configurators,
    containers,
    index,
  }: IViewDataSnapshotParams & { index: number }) {
    super({ meta, configurators, containers });
    this.index = index;
  }
}

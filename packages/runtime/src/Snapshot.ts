import { IConfiguratorMap } from './GammaElement';
import { IElementMeta } from './GammaElement';
import { PickConfiguratorValueTypeMap } from './Configurator';
import { LayoutMode } from './types';
import { Memento } from './Originator';
import { ViewDataType } from './ViewData';

export interface IRuntimeElementSnapshotMap {
  [key: string]: RuntimeElementSnapshot;
}

export interface IRuntimeElementSnapshotParams {
  id: string;
  meta: IElementMeta; // 元数据对象，记录 viewdata 的抽象数据
  configurators: PickConfiguratorValueTypeMap<IConfiguratorMap>; // 配置数据
}

export class RuntimeElementSnapshot implements Memento {
  readonly id: string;
  readonly meta: IElementMeta;
  readonly configurators: PickConfiguratorValueTypeMap<IConfiguratorMap>;
  constructor({ meta, configurators, id }: IRuntimeElementSnapshotParams) {
    this.id = id;
    this.meta = meta;
    this.configurators = configurators;
  }
}

export class ScriptDataSnapshot extends RuntimeElementSnapshot {
  readonly script = true;
}

type IViewDataSnapshotParams = IRuntimeElementSnapshotParams & {
  containers: string[][];
};

export class ViewDataSnapshot extends RuntimeElementSnapshot {
  readonly containers: string[][];
  type = ViewDataType.Normal;
  constructor({
    id,
    meta,
    configurators,
    containers,
  }: IViewDataSnapshotParams) {
    super({ meta, configurators, id });
    this.containers = containers;
  }
}
export class RootViewDataSnapshot extends ViewDataSnapshot {
  readonly type = ViewDataType.Root;
  readonly mode: LayoutMode;
  constructor({
    id,
    meta,
    configurators,
    containers,
    mode,
  }: IViewDataSnapshotParams & { mode: LayoutMode }) {
    super({ meta, configurators, containers, id });
    this.mode = mode;
  }
}

export class LayoutViewDataSnapshot extends ViewDataSnapshot {
  readonly type = ViewDataType.Layout;
  readonly index: number;
  constructor({
    id,
    meta,
    configurators,
    containers,
    index,
  }: IViewDataSnapshotParams & { index: number }) {
    super({ meta, configurators, containers, id });
    this.index = index;
  }
}

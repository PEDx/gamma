import { ConfiguratorMap } from "@/packages";
import { PickConfiguratorValueTypeMap } from "@/class/ConfiguratorGroup";
import { Memento } from "@/class/Memento/Memento";
import { WidgetMeta } from "@/class/Widget";


interface IViewDataSnapshotParams {
  meta?: WidgetMeta;
  isRoot: boolean;
  index?: number;
  configurators: PickConfiguratorValueTypeMap<ConfiguratorMap>;
  containers: string[][];
}

/**
 * 此为 viewData 的可序列化快照，可用来记录、回退状态等
 */
export class ViewDataSnapshot implements Memento {
  readonly meta?: WidgetMeta;
  readonly isRoot: boolean;
  readonly index?: number;
  readonly configurators: PickConfiguratorValueTypeMap<ConfiguratorMap>;
  readonly containers: string[][];
  constructor({
    meta, isRoot, index, configurators, containers
  }: IViewDataSnapshotParams) {
    this.meta = meta;
    this.isRoot = isRoot;
    this.index = index;
    this.configurators = configurators;
    this.containers = containers;
  }
}

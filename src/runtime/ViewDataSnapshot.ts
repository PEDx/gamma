import { ConfiguratorMap } from "@/runtime/CreationView";
import { PickConfiguratorValueTypeMap } from "@/runtime/ConfiguratorGroup";
import { Memento } from "@/commom/Memento/Memento";
import { WidgetMeta } from "@/runtime/CreationView";


interface IViewDataSnapshotParams {
  meta?: WidgetMeta;
  isLayout: boolean;
  index?: number;
  configurators: PickConfiguratorValueTypeMap<ConfiguratorMap>;
  containers: string[][];
}

/**
 * 此为 viewData 的可序列化快照，可用来记录、回退状态等
 */
export class ViewDataSnapshot implements Memento {
  readonly meta?: WidgetMeta;
  readonly isLayout: boolean;
  readonly index?: number;
  readonly configurators: PickConfiguratorValueTypeMap<ConfiguratorMap>;
  readonly containers: string[][];
  constructor({
    meta, isLayout, index, configurators, containers
  }: IViewDataSnapshotParams) {
    this.meta = meta;
    this.isLayout = isLayout;
    this.index = index;
    this.configurators = configurators;
    this.containers = containers;
  }
}

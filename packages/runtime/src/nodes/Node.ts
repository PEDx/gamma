import { Collection } from '../Collection';
import { IConfiguratorMap, IElementMeta } from '../GammaElement';
import { Originator, Memento } from '../Originator';
import { uuid } from '../utils';
import { NodeHelper } from './NodeHelper';

export interface INodeParams {
  id?: string;
  meta: IElementMeta;
  configurators: IConfiguratorMap;
}

/**
 * 只有 nodeCollection 中存有 node 的引用实体
 * 其他地方尽量只持有 node 的 id
 */
export const nodeCollection = new Collection<Node>();
export const nodeHelper = new NodeHelper();

export abstract class Node implements Originator {
  readonly id: string; // 唯一 id
  readonly meta: IElementMeta; // 元数据
  readonly configurators: IConfiguratorMap; // 配置器表
  private _suspend: boolean = false; // 是否悬空：节点在节点树中删除，但是不能销毁

  constructor({ id, configurators = {}, meta }: INodeParams) {
    this.id = id || `${uuid()}`;
    this.configurators = configurators;
    this.meta = meta;
    nodeCollection.addItem(this);
  }

  get suspend() {
    return this._suspend;
  }

  set suspend(value) {
    this._suspend = value;
  }

  abstract save(): Memento;

  abstract restore(memo: Memento): void;
}

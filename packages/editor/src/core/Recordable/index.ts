import {
  ConfigableNode,
  IConfiguratorValueMap,
} from '@gamma/runtime/src/nodes/ConfigableNode';
import { hash } from '@/utils';

export interface IRecord {
  [key: string]: unknown;
}

export interface IRecordNode {
  id: string;
  data: IRecord;
}

export class RecordNode {
  private node: ConfigableNode;
  private prev: IRecord = {};
  constructor(node: ConfigableNode) {
    this.node = node;
    this.shot();
  }
  /**
   * 计算出变化的属性
   * @returns
   */
  shot(): IConfiguratorValueMap {
    const { values, children } = this.node.save();
    return {};
  }
}

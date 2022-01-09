import { ValueEntity } from './ValueEntity';

export interface IOptionItem {
  value: unknown;
  name: string;
}
export interface IInnerOptionItem {
  value: unknown;
  name: string;
  check: boolean;
}

export type TOptions = IOptionItem[];

export class OptionsValueEntity extends ValueEntity<IOptionItem> {
  readonly options: TOptions;
  constructor(params: TOptions) {
    super(params[0]);
    this.options = params;
  }
  style() {
    return this.getValue();
  }
  override setValue(value: IOptionItem): void {}
  /**
   * 拿到的是全部配置项
   */
  override getValue(): IOptionItem {
    return 1 as any;
  }
}

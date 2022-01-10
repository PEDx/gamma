import { ValueEntity, IOValueEntity } from './ValueEntity';

export interface IOptionItem {
  value: unknown;
  name: string;
}

export type TOptions = IOptionItem[];

export class OptionsValueEntity extends IOValueEntity<
  IOptionItem,
  TOptions
> {
  private value: IOptionItem;
  private options: TOptions;
  constructor(params: TOptions) {
    super();
    this.options = params;
    this.value = params[0];
  }
  setValue(value: IOptionItem): void {
    this.value = value;
  }
  /**
   * 拿到的是全部配置项
   */
  getValue(): TOptions {
    return this.options;
  }
  style() {
    return this.value.value;
  }
}

import { ValueEntity } from './ValueEntity';

export interface IOptionItem {
  value: unknown;
  name: string;
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
}

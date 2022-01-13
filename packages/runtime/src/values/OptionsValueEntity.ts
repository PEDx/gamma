import { ValueEntity, IOValueEntity } from './ValueEntity';

export interface IOptionItem {
  value: number | string;
  name: string;
}
export interface IOptionInnerItem {
  value: number | string;
  name: string;
  check: boolean;
}

export type TOptions = IOptionItem[];
export type TInnerOptions = IOptionInnerItem[];

export class OptionsValueEntity extends ValueEntity<TInnerOptions> {
  constructor(params: TOptions) {
    super(params.map((item, idx) => ({ ...item, check: idx === 0 })));
  }
  style() {
    let check: IOptionInnerItem = {} as IOptionInnerItem;
    this.getValue().forEach((item) => {
      if (item.check) check = item;
    });
    if (!check) return null;
    return `${check.value}`;
  }
}

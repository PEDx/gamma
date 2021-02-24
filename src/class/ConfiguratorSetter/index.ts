import {
  StyleValue,
  StyleItem,
  UNIT,
} from '@/class/StyleSetter';

export enum ConfiguratorType {
  STRING,
  SECTION,
  NUMBER,
  BOOLEAN,
  UNIT_NUMBER,
  COLOR,
  GRADIENT_COLOR,
}

export interface Configurator {
  lable: string;
  name: string;
  describe?: string;
  type: ConfiguratorType;
  value: StyleValue;
}

export class ConfiguratorSetter implements Configurator {
  lable: string;
  name: string;
  describe?: string;
  valueIsStyleItem?: boolean;
  type: ConfiguratorType;
  value: StyleValue;
  constructor({ lable, name, type, value, describe }: Configurator) {
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
  }
  setValue(value: StyleValue) {
    this.value = value;
  }
  getValue() {
    return this.value;
  }
}

export class ConfiguratorStyleSetter extends StyleItem implements Configurator {
  lable: string;
  name: string;
  unit?: string;
  describe?: string;
  valueIsStyleItem?: boolean;
  type: ConfiguratorType;
  value: StyleValue;
  haveUnit?: boolean;
  constructor(
    { lable, name, type, value, describe }: Configurator,
    haveUnit?: boolean,
  ) {
    super();
    this.lable = lable;
    this.name = name;
    this.value = value;
    this.type = type;
    this.describe = describe;
    this.haveUnit = haveUnit;
    if (haveUnit) this.unit = UNIT.PX;
  }
  setValue(value: StyleValue): StyleValue {
    this.value = value;
    return this.value;
  }
  getValue(): StyleValue {
    if (this.haveUnit) return `${this.value}${this.unit}`;
    return this.value;
  }
  conversionUnit() {}
}

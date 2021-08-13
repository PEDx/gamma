declare type StringOrNumber = string | number;

declare interface ISelectOption {
  value: StringOrNumber;
  label: string;
  data?: unknown;
}

declare type RGBColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

declare interface IFontConfig {
  fontSize: number;
  lightHeight: number;
  letterSpace: number;
  fontFamily: string;
  fontWeight: string;
  align: string;
  vertical: string;
}

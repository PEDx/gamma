export type StringOrNumber = string | number;

export interface ISelectOption {
  value: StringOrNumber;
  label: string;
  data?: unknown;
}

export type RGBColor = {
  a?: number | undefined;
  b: number;
  g: number;
  r: number;
};

export interface IFontConfig {
  fontSize: number;
  lightHeight: number;
  letterSpace: number;
  fontFamily: string;
  fontWeight: string;
  align: string;
  vertical: string;
}

export enum LayoutMode {
  LongPage,
  MultPage,
  Pendant,
}

export interface IRichTextEditorData {
  json: unknown[];
  html: string;
}

export enum RuntimeEnv {
  Editor,
  Preview,
  Page,
}

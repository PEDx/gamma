export type StringOrNumber = string | number;

export type RGBColor = {
  a?: number | undefined;
  b: number;
  g: number;
  r: number;
};

export interface ISelectOption {
  value: StringOrNumber;
  label: string;
  data?: unknown;
}

export interface IFontConfig {
  fontSize: number;
  lightHeight: number;
  letterSpace: number;
  fontFamily: string;
  fontWeight: string;
  align: string;
  vertical: string;
}

export interface IBorderConfig {
  borderWidth: number;
  borderStyle:
    | 'dotted'
    | 'none'
    | 'dashed'
    | 'solid'
    | 'double'
    | 'inset'
    | 'outset';
  borderColor: RGBColor;
  borderRadius: number;
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


export enum DIRECTIONS {
  NULL,
  L = 1,
  R = 1 << 1,
  T = 1 << 2,
  B = 1 << 3,
}


export enum CHECK_EDGE {
  NULL,
  L = 1,
  R = 1 << 1,
  T = 1 << 2,
  B = 1 << 3,
  VM = 1 << 4,
  HM = 1 << 5,
  ALL = (1 << 6) - 1,
}

export enum UNIT {
  PX = 'px',
  PERCENT = '%',
  REM = 'rem',
}

export enum LINE_TYPE {
  VERTICAL, // 垂直
  HORIZONTAL, // 水平
}
export enum DARG_PANEL_TYPE {
  LEFT, //  左
  RIGHT, // 右
  NONE = 'none', // 右
}

export const ADSORB_DISTANCE = 5; // 吸附距离
export const MIN_PANEL_WIDTH = 150; // 最小 panel 宽度

export const GAMMA_PREFIX = 'gamma';

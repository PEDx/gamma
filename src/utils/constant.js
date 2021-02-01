export const DIRECTIONS = {
  L: 1,
  R: 1 << 1,
  T: 1 << 2,
  B: 1 << 3,
  NULL: 0,
};
export const CHECK_EDGE = {
  ...DIRECTIONS,
  VM: 1 << 4,
  HM: 1 << 5,
  ALL: (1 << 6) - 1,
};

export const LINE_TYPE = {
  VERTICAL: 0, // 垂直
  HORIZONTAL: 1, // 水平
};
export const DARG_PANEL_TYPE = {
  LEFT: 0, //  左
  RIGHT: 1, // 右
  NONE: null, // 右
};

export const ADSORB_DISTANCE = 5; // 吸附距离
export const MIN_PANEL_WIDTH = 150; // 最小 panel 宽度

export const EDITABLE_ELEMENTS_ID_PREFIX = 'editable_elements_';

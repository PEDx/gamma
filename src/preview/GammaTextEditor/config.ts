import { CustomTextFormat, CustomElementType } from '.';

export interface IMarkLeaf {
  name: string;
  format: CustomTextFormat;
}
export interface IBlockElement {
  name: string;
  format: CustomElementType;
}

export const MarkLeafButtonMap: IMarkLeaf[] = [
  {
    name: '粗体',
    format: 'bold',
  },
  {
    name: '斜体',
    format: 'italic',
  },
  {
    name: '下划线',
    format: 'underline',
  },
  {
    name: '代码块',
    format: 'code',
  },
];

export const MarkColorLeafButton: IMarkLeaf = {
  name: '文字颜色',
  format: 'color',
};

export const ElementButtonMap: IBlockElement[] = [
  {
    name: '引用',
    format: 'block-quote',
  },
  {
    name: '无序列表',
    format: 'bulleted-list',
  },
  {
    name: '有序列表',
    format: 'numbered-list',
  },
];

export const AlignButtonMap = [
  {
    name: '左对齐',
    format: 'align-left',
  },
  {
    name: '中对齐',
    format: 'align-center',
  },
  {
    name: '右对齐',
    format: 'align-right',
  },
  {
    name: '两边对齐',
    format: 'align-justify',
  },
];

/**
 * 文本内容类型实现为一组其他操作的集合
 */
export type BlockContentType =
  | 'paragraph'
  | 'heading-one'
  | 'heading-two'
  | 'heading-three'
  | 'heading-four';

export const ContentTextTypeMap = {
  paragraph: {
    name: '普通文本',
    value: 'paragraph',
    fontSize: '14px',
  },
  'heading-one': {
    name: '标题',
    value: 'heading-one',
    fontSize: '32px',
  },
  'heading-two': {
    name: '二级标题',
    value: 'heading-two',
    fontSize: '28px',
  },
  'heading-three': {
    name: '三级标题',
    value: 'heading-three',
    fontSize: '26px',
  },
  'heading-four': {
    name: '四级标题',
    value: 'heading-four',
    fontSize: '22px',
  },
};

export const FontSizeTypeMap = [
  {
    name: '10px',
    value: '10px',
  },
  {
    name: '12px',
    value: '12px',
  },
  {
    name: '14px',
    value: '14px',
  },
  {
    name: '16px',
    value: '16px',
  },
  {
    name: '18px',
    value: '18px',
  },
  {
    name: '24px',
    value: '24px',
  },
  {
    name: '32px',
    value: '32px',
  },
  {
    name: '48px',
    value: '48px',
  },
  {
    name: '64px',
    value: '64px',
  },
  {
    name: '72px',
    value: '72px',
  },
  {
    name: '84px',
    value: '84px',
  },
];

export const FontFamilyTypeMap = [
  {
    name: '苹方',
    value: 'PingFang SC',
  },
  {
    name: '华文黑体',
    value: 'STHeiti',
  },
  {
    name: '华文楷体',
    value: 'STKaiti',
  },
  {
    name: '华文宋体',
    value: 'STSong',
  },
  {
    name: '华文仿宋',
    value: 'STFangsong',
  },
  {
    name: '华文中宋',
    value: 'STZhongsong',
  },
  {
    name: '华文琥珀',
    value: 'STHupo',
  },
  {
    name: '华文新魏',
    value: 'STXinwei',
  },
  {
    name: '华文隶书',
    value: 'STLiti',
  },
  {
    name: '华文行楷',
    value: 'STXingkai',
  },
  {
    name: '冬青黑体简',
    value: 'Hiragino Sans GB',
  },
  {
    name: '兰亭黑-简',
    value: 'Lantinghei SC',
  },
  {
    name: '翩翩体-简',
    value: 'Hanzipen SC',
  },
  {
    name: '手札体-简',
    value: 'Hannotate SC',
  },
  {
    name: '宋体-简',
    value: 'Songti SC',
  },
  {
    name: '娃娃体-简',
    value: 'Wawati SC',
  },
  {
    name: '魏碑-简',
    value: 'Weibei SC',
  },
  {
    name: '行楷-简',
    value: 'Xingkai SC',
  },
  {
    name: '雅痞-简',
    value: 'Yapi SC',
  },
  {
    name: '圆体-简',
    value: 'Yuanti SC',
  },
];

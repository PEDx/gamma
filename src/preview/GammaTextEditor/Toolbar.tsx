import { Icon } from '@/icons';
import { Box, Button, IconButton, Select } from '@chakra-ui/react';
import { useSlate } from 'slate-react';
import { CustomCommand } from './CustomCommand';
import { CustomElementType, CustomTextFormat } from '.';
import { ColorPicker } from './ColorPicker';
import { useState } from 'react';

interface IMarkLeaf {
  name: string;
  format: CustomTextFormat;
}
interface IBlockElement {
  name: string;
  format: CustomElementType;
}

const MarkLeafButtonMap: IMarkLeaf[] = [
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

const MarkColorLeafButton: IMarkLeaf = {
  name: '文字颜色',
  format: 'color',
};

const ElementButtonMap: IBlockElement[] = [
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

/**
 * 文本内容类型实现为一组其他操作的集合
 */
const ContentTextTypeMap = [
  {
    name: '普通文本',
    value: 'normal',
  },
  {
    name: '标题',
    value: 'head',
  },
  {
    name: '副标题',
    value: 'subhead',
  },
  {
    name: '二级标题',
    value: 'secondHead',
  },
  {
    name: '三级标题',
    value: 'thirdHead',
  },
  {
    name: '四级标题',
    value: 'fourthHead',
  },
];
const FontFamilyTypeMap = [
  {
    name: '宋体',
    value: 'SimSun',
  },
  {
    name: '黑体',
    value: 'SimHei',
  },
  {
    name: '微软雅黑',
    value: 'Microsoft Yahei',
  },
  {
    name: '微软正黑体',
    value: 'Microsoft JhengHei',
  },
  {
    name: '楷体',
    value: 'KaiTi',
  },
  {
    name: '新宋体',
    value: 'NSimSun',
  },
  {
    name: '仿宋',
    value: 'FangSong',
  },
];
const FontSizeTypeMap = [
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

export const Toolbar = () => {
  const [showPicker, setShowPicker] = useState(false);
  const editor = useSlate();
  return (
    <Box className="toolbar flex-box" position="relative">
      <Box
        position="absolute"
        zIndex="2"
        top="34px"
        right="0"
        display={showPicker ? 'block' : 'none'}
        className="color-picker"
      >
        <ColorPicker
          color={
            (CustomCommand.getMarkValue(
              editor,
              MarkColorLeafButton.format,
            ) as string) || ''
          }
          onOutClick={() => {
            setShowPicker(false);
          }}
          onColorPick={(color) => {
            CustomCommand.setMark(editor, 'color', `#${color}`);
          }}
        />
      </Box>
      <Select
        w="100px"
        mr="8px"
        onChange={(event) => {
          console.log(event.target.value);
        }}
      >
        {ContentTextTypeMap.map((content) => (
          <option value={content.value} key={content.value}>
            {content.name}
          </option>
        ))}
      </Select>
      <Select
        w="100px"
        mr="8px"
        value={
          (CustomCommand.getMarkValue(editor, 'fontFamily') as string) || ''
        }
        onChange={(event) => {
          CustomCommand.setMark(editor, 'fontFamily', event.target.value);
        }}
      >
        {FontFamilyTypeMap.map((content) => (
          <option value={content.value} key={content.value}>
            {content.name}
          </option>
        ))}
      </Select>
      <Select
        w="80px"
        mr="8px"
        value={(CustomCommand.getMarkValue(editor, 'fontSize') as string) || ''}
        onChange={(event) => {
          CustomCommand.setMark(editor, 'fontSize', event.target.value);
          event.preventDefault()
        }}
      >
        {FontSizeTypeMap.map((content) => (
          <option value={content.value} key={content.value}>
            {content.name}
          </option>
        ))}
      </Select>
      {MarkLeafButtonMap.map((mark) => {
        return (
          <IconButton
            key={mark.format}
            aria-label={mark.name}
            mr="8px"
            isActive={CustomCommand.isMarkActive(editor, mark.format)}
            _active={{
              bg: '#aaa',
              borderColor: '#bec3c9',
              color: '#fff',
            }}
            icon={<Icon fontSize="16px" name={mark.format} />}
            onMouseDown={(event) => {
              event.preventDefault();
              if (mark.format === 'color') {
                setShowPicker(!showPicker);
                event.stopPropagation();
                return;
              }
              CustomCommand.toggleMark(editor, mark.format);
            }}
          />
        );
      })}
      <IconButton
        key={MarkColorLeafButton.format}
        aria-label={MarkColorLeafButton.name}
        mr="8px"
        icon={
          <Icon
            color={
              (CustomCommand.getMarkValue(
                editor,
                MarkColorLeafButton.format,
              ) as string) || ''
            }
            fontSize="16px"
            name={MarkColorLeafButton.format}
          />
        }
        onMouseDown={(event) => {
          event.preventDefault();
          setShowPicker(!showPicker);
          event.stopPropagation();
        }}
      />
      {ElementButtonMap.map((mark) => {
        return (
          <IconButton
            key={mark.format}
            aria-label={mark.name}
            mr="8px"
            isActive={CustomCommand.isBlockActive(editor, mark.format)}
            _active={{
              bg: '#aaa',
              borderColor: '#bec3c9',
              color: '#fff',
            }}
            icon={<Icon fontSize="16px" name={mark.format} />}
            onMouseDown={(event) => {
              event.preventDefault();
              CustomCommand.toggleBlock(editor, mark.format);
            }}
          />
        );
      })}
    </Box>
  );
};

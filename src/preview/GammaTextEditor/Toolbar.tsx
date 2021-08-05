import { Icon } from '@/icons';
import { Box, Button, IconButton, Select } from '@chakra-ui/react';
import { ReactEditor, useSlate } from 'slate-react';
import { CustomCommand } from './CustomCommand';
import { CustomElementType } from '.';
import { ColorPicker } from './ColorPicker';
import { useState } from 'react';
import {
  AlignButtonMap,
  ContentTextTypeMap,
  ElementButtonMap,
  FontFamilyTypeMap,
  FontSizeTypeMap,
  MarkColorLeafButton,
  MarkLeafButtonMap,
} from './config';
import { insertImage, isImageUrl } from './Image';

export const Toolbar = () => {
  const [showPicker, setShowPicker] = useState(false);
  const editor = useSlate();
  return (
    <Box
      className="toolbar flex-box"
      position="relative"
      onMouseDown={() => {
        ReactEditor.focus(editor);
      }}
    >
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
            ReactEditor.focus(editor);
          }}
        />
      </Box>
      <Select
        w="100px"
        mr="8px"
        value={CustomCommand.getBlockValue(editor, 'type') as string}
        onChange={(event) => {
          CustomCommand.setBlock(
            editor,
            event.target.value as CustomElementType,
          );
          ReactEditor.focus(editor);
        }}
      >
        {Object.values(ContentTextTypeMap).map((content) => (
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
          ReactEditor.focus(editor);
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
          ReactEditor.focus(editor);
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
            title={mark.name}
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
        title={MarkColorLeafButton.name}
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
            title={mark.name}
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
      {AlignButtonMap.map((align) => {
        return (
          <IconButton
            key={align.icon}
            aria-label={align.name}
            title={align.name}
            mr="8px"
            isActive={CustomCommand.isBlockAlignValue(editor, align.value)}
            _active={{
              bg: '#aaa',
              borderColor: '#bec3c9',
              color: '#fff',
            }}
            onMouseDown={(event) => {
              event.preventDefault();
              CustomCommand.setBlockAlignValue(editor, align.value);
            }}
            icon={<Icon fontSize="16px" name={align.icon} />}
          />
        );
      })}
      <IconButton
        key="image"
        aria-label="图片"
        title="图片"
        mr="8px"
        icon={<Icon fontSize="16px" name="image-fill" />}
        onMouseDown={(event) => {
          event.preventDefault();
          const url = window.prompt('Enter the URL of the image:');
          if (url && !isImageUrl(url)) {
            alert('URL is not an image');
            return;
          }
          url && insertImage(editor, url);
        }}
      />
      <IconButton
        key="link"
        aria-label="链接"
        title="链接"
        mr="8px"
        icon={<Icon fontSize="16px" name="link" />}
      />
      <IconButton
        key="unlink"
        aria-label="取消链接"
        title="取消链接"
        mr="8px"
        icon={<Icon fontSize="16px" name="unlink" />}
      />
    </Box>
  );
};

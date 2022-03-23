import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import tinycolor from 'tinycolor2';
import { useAwayListener } from '@/hooks/useAwayListener';

const colorList = [
  '#000000',
  '#FFFFFF',
  '#ABB8C3',
  '#FF6900',
  '#FCB900',
  '#7BDCB5',
  '#00D084',
  '#8ED1FC',
  '#0693E3',
  '#EB144C',
  '#F78DA7',
  '#9900EF',
];

interface IColorPickerProps {
  color: string;
  onOutClick: () => void;
  onColorPick: (color: string) => void;
}

export const ColorPicker = ({
  color = colorList[0],
  onOutClick,
  onColorPick,
}: IColorPickerProps) => {
  const [colorStr, setColorStr] = useState(color);
  const ref = useRef(null);
  const [inputValue, setInputValue] = useState(tinycolor(colorStr).toHex());

  useAwayListener(ref, () => {
    onOutClick();
  });

  useEffect(() => {
    setColorStr(color.toUpperCase());
  }, [color]);

  useEffect(() => {
    onColorPick(inputValue);
  }, [inputValue]);

  return (
    <Box
      w="240px"
      h="100px"
      onMouseDown={(event) => event.preventDefault()}
      ref={ref}
    >
      <Box p="8px" onMouseDown={(event) => event.preventDefault()}>
        {colorList.map((color) => (
          <Box
            borderRadius="4px"
            display="inline-block"
            cursor="pointer"
            key={color}
            w="26px"
            h="26px"
            bg={color}
            mr="6px"
            boxShadow={colorStr === color ? `${colorStr} 0 0 4px` : ''}
            onMouseDown={(event) => {
              setColorStr(color);
              setInputValue(tinycolor(color).toHex());
              event.preventDefault();
            }}
          ></Box>
        ))}
        <Box position="relative">
          <Stack spacing={4} w="100px">
            <InputGroup borderRadius="4px">
              <InputLeftElement
                pointerEvents="none"
                color={colorStr}
                fontSize="1.2em"
                fontWeight="bold"
                textShadow="1px 1px  #dedede"
                children="#"
                h="26px"
              />
              <Input
                type="tel"
                h="26px"
                borderRadius="4px"
                pl="20px"
                fontSize="14px"
                maxLength={6}
                value={inputValue.toUpperCase()}
                onChange={(event) => {
                  console.log(tinycolor(event.target.value).isValid());
                  setInputValue(event.target.value.toUpperCase());
                }}
              />
            </InputGroup>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

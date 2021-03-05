import { useEffect, FC, useState, useRef } from 'react';
import {
  Box,
  Flex,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { SketchPicker, Color, RGBColor } from 'react-color';
import useClickAwayListener from '@/hooks/useClickAwayListener';

export const GradientColorPicker: FC = () => {
  const pickRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState<RGBColor>({
    r: 241,
    g: 112,
    b: 19,
    a: 1,
  });
  useEffect(() => {}, []);
  useClickAwayListener(pickRef, () => {
    setShowPicker(false);
  });
  return (
    <Box position="relative">
      <Flex ref={pickRef} align="center">
        <Box
          onClick={() => {
            setShowPicker(!showPicker);
          }}
          flex="1"
          h="18px"
          cursor="pointer"
          borderRadius="2px"
          border="1px solid #aaa"
          style={{
            backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          }}
        ></Box>
        <CNumberInput size="xs" w="60px" ml="8px">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </CNumberInput>
        {showPicker ? (
          <Box position="absolute" zIndex="2" color="#333">
            <SketchPicker
              color={color as Color}
              width="230px"
              disableAlpha={false}
              onChangeComplete={(color) => {
                setColor(color.rgb);
              }}
              onChange={(color) => {
                setColor(color.rgb);
              }}
            />
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
};

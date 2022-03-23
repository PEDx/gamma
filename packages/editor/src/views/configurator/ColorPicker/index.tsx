import { useEffect, useState, useRef, useCallback } from 'react';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useOutsideClick,
} from '@chakra-ui/react';
import { SketchPicker } from 'react-color';
import { RGBColor } from '@gamma/runtime';
import tinycolor from 'tinycolor2';
import { IConfiguratorComponentProps } from '..';
import { NumberInput } from '../NumberInput';
import { isEqual } from 'lodash';

const main_color = {
  r: 241,
  g: 112,
  b: 19,
  a: 1,
};

export function ColorPicker({
  value,
  onChange,
}: IConfiguratorComponentProps<RGBColor>) {
  const [localValue, setLocalValue] = useState<RGBColor>(value);

  const oldValue = useRef(localValue);

  const pickRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [hexValue, setHexValue] = useState('');
  const [alpha, setAlpha] = useState(100);

  useOutsideClick({
    ref: pickRef,
    handler: () => {
      setShowPicker(false);
    },
  });

  useEffect(() => {
    updataInput(localValue);
  }, [localValue]);

  useEffect(() => {
    if (isEqual(value, localValue)) return;
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isEqual(oldValue.current, localValue)) return;
    oldValue.current = localValue;
    onChange({ ...localValue });
  }, [localValue]);

  const updataInput = useCallback((color: RGBColor) => {
    setAlpha(Math.ceil((color.a || 1) * 100));
    setHexValue(tinycolor(color).toHex());
  }, []);

  const handleChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      const value = ev.target.value;
      setHexValue(value);
    },
    [],
  );

  return (
    <Box ref={pickRef} position="relative">
      <Flex alignItems="center">
        <InputGroup flex="1" mr="6px">
          <InputLeftElement
            pointerEvents="none"
            children={
              <Box fontSize={14} color={'#eee'} fontWeight={'bold'}>
                #
              </Box>
            }
          />
          <Input
            value={hexValue}
            onChange={handleChange}
            maxLength={6}
            pattern="/^[0-9a-fA-F]{6}$/g"
          />
          <InputLeftElement w="20px" zIndex="1">
            <Box
              onClick={() => {
                setShowPicker(!showPicker);
              }}
              w="16px"
              h="16px"
              cursor="pointer"
              style={{
                backgroundColor: `rgba(${localValue.r}, ${localValue.g}, ${localValue.b}, ${localValue.a})`,
              }}
            ></Box>
          </InputLeftElement>
        </InputGroup>
        <Box w="70px">
          <NumberInput
            value={alpha}
            onChange={(num) => {
              const alphaDot = +(num / 100).toFixed(2);
              localValue.a = alphaDot;
              setLocalValue({ ...localValue });
            }}
          ></NumberInput>
        </Box>
      </Flex>
      {showPicker ? (
        <Box position="absolute" zIndex="2" right="0" color="#333">
          <SketchPicker
            color={localValue}
            width="220px"
            disableAlpha={false}
            onChangeComplete={(color) => {
              updataInput(color.rgb);
            }}
            onChange={(color) => {
              setLocalValue(color.rgb);
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
}

import {
  useEffect,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useOutsideClick,
} from '@chakra-ui/react';
import { SketchPicker, RGBColor } from 'react-color';
import { NumberInput } from '@/editor/configurator/NumberInput';
import tinycolor from 'tinycolor2';
import { ConfiguratorComponent, StringOrNumber } from '@/class/Configurator';

const format = (val: number) => `${val}%`;

export const ColorPicker = forwardRef<
  ConfiguratorComponent<RGBColor>['methods'],
  ConfiguratorComponent<RGBColor>['props']
>(({ onChange }, ref) => {
  const pickRef = useRef<HTMLDivElement>(null);
  const alphaValueRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const [showPicker, setShowPicker] = useState(false);
  const [colorHexValue, setColorHexValue] = useState('');
  const [colorRGBA, setColorRGBA] = useState<RGBColor>({
    r: 241,
    g: 112,
    b: 19,
    a: 1,
  });

  useOutsideClick({
    ref: pickRef,
    handler: () => {
      setShowPicker(false);
    },
  });

  const update = useCallback((rbga: RGBColor) => {
    const color = tinycolor(rbga);
    onChange(rbga);
    updateLocalInputColor(color);
  }, []);

  const updateLocalInputColor = useCallback((color: tinycolor.Instance) => {
    setColorHexValue(color.toHex());
    alphaValueRef.current?.setValue((color.getAlpha() * 100).toFixed(0));
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        if (!value) return;
        setColorRGBA(value);
        updateLocalInputColor(tinycolor(value));
      },
    }),
    [],
  );

  return (
    <Box ref={pickRef} position="relative">
      <Flex alignItems="center">
        <InputGroup flex="1" mr="8px">
          <Input value={`#${colorHexValue}`} onChange={() => {}} />
          <InputLeftElement w="20px">
            <Box
              onClick={() => {
                setShowPicker(!showPicker);
              }}
              w="14px"
              h="14px"
              cursor="pointer"
              style={{
                backgroundColor: `rgba(${colorRGBA.r}, ${colorRGBA.g}, ${colorRGBA.b}, ${colorRGBA.a})`,
              }}
            ></Box>
          </InputLeftElement>
        </InputGroup>
        <Box w="76px">
          <NumberInput
            max={100}
            min={0}
            suffix="%"
            ref={alphaValueRef}
            onChange={(num) => {
              const alpha = (num / 100).toFixed(2);
              const newColor = {
                ...colorRGBA,
                a: +alpha,
              };
              setColorRGBA(newColor);
              update(newColor);
            }}
          ></NumberInput>
        </Box>
      </Flex>
      {showPicker ? (
        <Box position="absolute" zIndex="2" right="0" color="#333">
          <SketchPicker
            color={colorRGBA}
            width="220px"
            disableAlpha={false}
            onChangeComplete={(color) => {
              update(color.rgb);
              setColorHexValue(tinycolor(color.rgb).toHex());
            }}
            onChange={(color) => {
              setColorRGBA(color.rgb);
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
});

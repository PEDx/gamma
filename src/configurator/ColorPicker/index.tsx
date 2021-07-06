import {
  useEffect,
  forwardRef,
  useState,
  useRef,
  useImperativeHandle,
} from 'react';
import { Box, useOutsideClick } from '@chakra-ui/react';
import { SketchPicker, Color, RGBColor } from 'react-color';
import { ConfiguratorComponent } from '@/class/Configurator';

export const ColorPicker = forwardRef<
  ConfiguratorComponent<RGBColor>['methods'],
  ConfiguratorComponent<RGBColor>['props']
>(({ onChange }, ref) => {
  const pickRef = useRef<HTMLDivElement>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [color, setColor] = useState<RGBColor>({
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

  useEffect(() => {
    // if (showPicker === false) {
    //   onChange(color);
    // }
  }, [showPicker]);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {
        if (!value) return;
        setColor(value);
      },
    }),
    [],
  );
  return (
    <Box color="#333" ref={pickRef} position="relative">
      <Box
        onClick={() => {
          setShowPicker(!showPicker);
        }}
        w="36px"
        h="18px"
        cursor="pointer"
        borderRadius="2px"
        border="1px solid #aaa"
        style={{
          backgroundColor: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        }}
      ></Box>
      {showPicker ? (
        <Box position="absolute" zIndex="2">
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
    </Box>
  );
});

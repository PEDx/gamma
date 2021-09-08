import {
  useImperativeHandle,
  forwardRef,
  useRef,
  useCallback,
  useState,
} from 'react';
import {
  ConfiguratorComponent,
  IBorderConfig,
  RGBColor,
  StringOrNumber,
} from '@gamma/runtime';
import { Box, Flex, Select } from '@chakra-ui/react';
import { NumberInput } from '@/configurator/NumberInput';
import { ColorPicker } from '@/configurator/ColorPicker';
import { Icon } from '@/icons';

const borderStyleList: IBorderConfig['borderStyle'][] = [
  'none',
  'dashed',
  'solid',
  'dotted',
  'double',
  'inset',
  'outset',
];

export const BorderConfig = forwardRef<
  ConfiguratorComponent<IBorderConfig>['methods'],
  ConfiguratorComponent<IBorderConfig>['props']
>(({ onChange }, ref) => {
  const borderWidthRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const borderRadiusRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const colorRef = useRef<ConfiguratorComponent<RGBColor>['methods'] | null>(
    null,
  );
  const [borderStyleValue, setBorderStyleValue] = useState(borderStyleList[0]);

  const borderObj = useRef<IBorderConfig>({
    borderWidth: 0,
    borderRadius: 0,
    borderStyle: 'none',
    borderColor: {
      r: 241,
      g: 112,
      b: 19,
      a: 1,
    },
  });

  const update = useCallback(() => {
    onChange({ ...borderObj.current });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (border) => {
        borderObj.current = { ...border };
        borderWidthRef.current?.setValue(border.borderWidth || 0);
        borderRadiusRef.current?.setValue(border.borderRadius || 0);
        colorRef.current?.setValue(border.borderColor);
        setBorderStyleValue(border.borderStyle || 'none');
      },
    }),
    [],
  );
  return (
    <Box>
      <Flex mb="8px">
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <Icon name="stroke-width" mr="4px" />
          <NumberInput
            onChange={(value) => {
              borderObj.current.borderWidth = value;
              update();
            }}
            ref={borderWidthRef}
          />
        </Flex>
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <Icon name="radius" mr="4px" />
          <NumberInput
            onChange={(value) => {
              borderObj.current.borderRadius = value;
              update();
            }}
            ref={borderRadiusRef}
          />
        </Flex>
      </Flex>
      <Flex mb="8px">
        <ColorPicker
          ref={colorRef}
          onChange={(value) => {
            borderObj.current.borderColor = value;
            update();
          }}
        />
      </Flex>
      <Flex>
        <Select
          mr="8px"
          onChange={(event) => {
            const value = event.target.value as IBorderConfig['borderStyle'];
            borderObj.current.borderStyle = value;
            setBorderStyleValue(value);
            update();
          }}
          value={borderStyleValue}
        >
          {borderStyleList.map((style, idx) => (
            <option value={`${style}`} key={idx}>
              {style}
            </option>
          ))}
        </Select>
      </Flex>
    </Box>
  );
});

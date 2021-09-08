import {
  useImperativeHandle,
  forwardRef,
} from 'react';
import { ConfiguratorComponent, IBorderConfig } from '@gamma/runtime';
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
  useImperativeHandle(
    ref,
    () => ({
      setValue: (border) => {},
    }),
    [],
  );
  return (
    <Box>
      <Flex mb="8px">
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <Icon name="stroke-width" mr="4px" />
          <NumberInput onChange={(value) => {}} />
        </Flex>
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <Icon name="radius" mr="4px" />
          <NumberInput onChange={(value) => {}} />
        </Flex>
      </Flex>
      <Flex mb="8px">
        <ColorPicker onChange={() => {}} />
      </Flex>
      <Flex>
        <Select mr="8px" onChange={(event) => {}}>
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

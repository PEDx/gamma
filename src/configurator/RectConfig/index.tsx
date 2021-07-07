import { Box, HStack } from '@chakra-ui/react';
import { IRect } from '@/class/Editable';
import { ConfiguratorComponent, StringOrNumber } from '@/class/Configurator';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { NumberInput } from '@/configurator/NumberInput';

// TODO 配置位置大小

export const RectConfig = forwardRef<
  ConfiguratorComponent<IRect>['methods'],
  ConfiguratorComponent<IRect>['props']
>(({ onChange }, ref) => {
  const rectXRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const rectYRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const rectWidthRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const rectHeightRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);

  const rectObj = useRef<IRect>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const updata = useCallback(() => {
    onChange({ ...rectObj.current });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (rect) => {
        if (!rect) return;
        rectObj.current = rect;
        rectXRef.current?.setValue(rect.x);
        rectYRef.current?.setValue(rect.y);
        rectWidthRef.current?.setValue(rect.width);
        rectHeightRef.current?.setValue(rect.height);
      },
    }),
    [],
  );

  return (
    <Box>
      <HStack spacing="8px" mb="8px">
        <HStack spacing="2px">
          <Box opacity="0.6" w="12px" textAlign="center">
            X
          </Box>
          <Box flex="1">
            <NumberInput
              ref={rectXRef}
              onChange={(value) => {
                rectObj.current.x = value;
                updata();
              }}
            />
          </Box>
        </HStack>
        <HStack spacing="2px">
          <Box opacity="0.6" w="12px" textAlign="center">
            Y
          </Box>
          <Box flex="1">
            <NumberInput
              ref={rectYRef}
              onChange={(value) => {
                rectObj.current.y = value;
                updata();
              }}
            />
          </Box>
        </HStack>
      </HStack>
      <HStack spacing="8px">
        <HStack spacing="2px">
          <Box opacity="0.6" w="12px" textAlign="center">
            W
          </Box>
          <Box flex="1">
            <NumberInput
              ref={rectWidthRef}
              onChange={(value) => {
                rectObj.current.width = value;
                updata();
              }}
            />
          </Box>
        </HStack>
        <HStack spacing="2px">
          <Box opacity="0.6" w="12px" textAlign="center">
            H
          </Box>
          <Box flex="1">
            <NumberInput
              ref={rectHeightRef}
              onChange={(value) => {
                rectObj.current.height = value;
                updata();
              }}
            />
          </Box>
        </HStack>
      </HStack>
    </Box>
  );
});

import {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  Box,
  Select,
  Flex,
  NumberInput as CNumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useRadioGroup,
  HStack,
} from '@chakra-ui/react';
import {
  FontSizeIcon,
  LineHeightIcon,
  BoldIcon,
  LetterSpaceIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  VerticalTopIcon,
  VerticalCenterIcon,
  VerticalBottomIcon,
} from '@/chakra/icon';
import { ConfiguratorComponentString } from '@/class/Configurator';
import { RadioTag } from '@/components/RadioTag';
import { fontMap, isSupportFontFamily, Font, rootFontFamily } from './font';

const fontWeightList = ['normal', 'bold', 'bolder', 'lighter'];
const alignOptions = [
  {
    value: 'left',
    icon: <AlignLeftIcon />,
  },
  {
    value: 'center',
    icon: <AlignCenterIcon />,
  },
  {
    value: 'right',
    icon: <AlignRightIcon />,
  },
];
const verticalOptions = [
  {
    value: 'top',
    icon: <VerticalTopIcon />,
  },
  {
    value: 'center',
    icon: <VerticalCenterIcon />,
  },
  {
    value: 'bottom',
    icon: <VerticalBottomIcon />,
  },
];

export const FontConfig = forwardRef<
  ConfiguratorComponentString['methods'],
  ConfiguratorComponentString['props']
>(({ onChange }, ref) => {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: console.log,
  });
  const [fontFamilyValue, setFontFamilyValue] = useState('');
  const [fontWeightValue, setFontWeightValue] = useState(fontWeightList[0]);
  const [fontFamilyList, setFontFamilyList] = useState<Font[]>([]);

  useEffect(() => {
    const promiseList: Promise<boolean>[] = [];
    const arrFont = fontMap['OS X'];
    arrFont.forEach((font) => {
      const fontFamily = font.en;
      promiseList.push(isSupportFontFamily(fontFamily));
    });
    Promise.all(promiseList).then((bols) => {
      const arr: Font[] = [];
      arrFont.forEach((font, idx) => {
        if (bols[idx]) arr.push(font);
      });
      setFontFamilyList(arr);
    });
  }, []);

  useEffect(() => {
    setFontFamilyValue(rootFontFamily);
  }, [fontFamilyList]);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (value) => {},
    }),
    [],
  );

  const group = getRootProps();

  return (
    <Box>
      <Box mb="8px">
        <Select
          placeholder="选择字体"
          value={fontFamilyValue}
          onChange={(event) => {
            const value = event.target.value;
            setFontFamilyValue(value);
          }}
        >
          {fontFamilyList.map((font, idx) => (
            <option value={`"${font.en}"`} key={idx}>
              {font.ch}
            </option>
          ))}
        </Select>
      </Box>
      <Flex mb="8px">
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <FontSizeIcon mr="4px" />
          <CNumberInput size="xs" value={12} onChange={(s, n) => {}}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </CNumberInput>
        </Flex>
        <Flex w="50%" alignItems="center" justifyContent="center">
          <BoldIcon mr="4px" />
          <Box flex="1">
            <Select
              mr="8px"
              value={fontWeightValue}
              onChange={(event) => {
                const value = event.target.value;
                setFontWeightValue(value);
              }}
            >
              {fontWeightList.map((weight, idx) => (
                <option value={`"${weight}"`} key={idx}>
                  {weight}
                </option>
              ))}
            </Select>
          </Box>
        </Flex>
      </Flex>
      <Flex mb="8px">
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <LineHeightIcon mr="4px" />
          <CNumberInput size="xs" value={12} onChange={(s, n) => {}}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </CNumberInput>
        </Flex>
        <Flex w="50%" alignItems="center" justifyContent="center">
          <LetterSpaceIcon mr="4px" />
          <CNumberInput size="xs" value={12} onChange={(s, n) => {}}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </CNumberInput>
        </Flex>
      </Flex>
      <Flex mb="8px">
        <HStack {...group} w="50%" justify="space-between" mr="8px" spacing="0">
          {alignOptions.map(({ value, icon }) => {
            const radio = getRadioProps({ value });
            return (
              <RadioTag key={value} {...radio}>
                {icon}
              </RadioTag>
            );
          })}
        </HStack>
        <HStack {...group} w="50%" justify="space-between" spacing="0">
          {verticalOptions.map(({ value, icon }) => {
            const radio = getRadioProps({ value });
            return (
              <RadioTag key={value} {...radio}>
                {icon}
              </RadioTag>
            );
          })}
        </HStack>
      </Flex>
    </Box>
  );
});

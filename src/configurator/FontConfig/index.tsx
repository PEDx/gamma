import {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
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
import {
  ConfiguratorComponent,
  ConfiguratorComponentNumber,
} from '@/class/Configurator';
import { NumberInput } from '@/configurator/NumberInput';
import { RadioTag } from '@/components/RadioTag';
import { fontMap, isSupportFontFamily, Font, rootFontFamily } from './font';

export interface FontConfig {
  fontSize: number;
  lightHeight: number;
  letterSpace: number;
  fontFamily: string;
  fontWeight: string;
  align: string;
  vertical: string;
}

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
  ConfiguratorComponent<FontConfig>['methods'],
  ConfiguratorComponent<FontConfig>['props']
>(({ onChange }, ref) => {
  const fontSizeRef = useRef<ConfiguratorComponentNumber['methods'] | null>(
    null,
  );
  const lightHeightRef = useRef<ConfiguratorComponentNumber['methods'] | null>(
    null,
  );
  const letterSpaceRef = useRef<ConfiguratorComponentNumber['methods'] | null>(
    null,
  );

  const { getRadioProps: getAlighRadioProps, setValue: setAlignValue } =
    useRadioGroup({
      name: 'align',
      defaultValue: 'left',
      onChange: (value) => {
        console.log(value);
      },
    });
  const { getRadioProps: getVerticalRadioProps, setValue: setVerticalValue } =
    useRadioGroup({
      name: 'vertical',
      defaultValue: 'top',
      onChange: (value) => {
        console.log(value);
      },
    });
  const [fontFamilyValue, setFontFamilyValue] = useState(rootFontFamily);
  const [fontSizeValue, setFontSizeValue] = useState(12);
  const [lightHeightValue, setLightHeightValue] = useState(20);
  const [letterSpaceValue, setLetterSpaceValue] = useState(0);
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

  useImperativeHandle(
    ref,
    () => ({
      setValue: (font) => {
        if (!font) return;
        setAlignValue(font.align);
        setVerticalValue(font.vertical);
        fontSizeRef.current?.setValue(font.fontSize);
        lightHeightRef.current?.setValue(font.lightHeight);
        letterSpaceRef.current?.setValue(font.letterSpace);
      },
    }),
    [],
  );

  return (
    <Box>
      <Box mb="8px">
        <Select
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
          <NumberInput
            ref={fontSizeRef}
            onChange={(value) => {
              setFontSizeValue(value);
            }}
          />
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
          <NumberInput
            ref={lightHeightRef}
            onChange={(value) => {
              setLightHeightValue(value);
            }}
          />
        </Flex>
        <Flex w="50%" alignItems="center" justifyContent="center">
          <LetterSpaceIcon mr="4px" />
          <NumberInput
            ref={letterSpaceRef}
            onChange={(value) => {
              setLetterSpaceValue(value);
            }}
          />
        </Flex>
      </Flex>
      <Flex>
        <HStack w="50%" justify="space-between" mr="8px" spacing="0">
          {alignOptions.map(({ value, icon }) => {
            const radio = getAlighRadioProps({ value });
            return (
              <RadioTag key={value} {...radio}>
                {icon}
              </RadioTag>
            );
          })}
        </HStack>
        <HStack w="50%" justify="space-between" spacing="0">
          {verticalOptions.map(({ value, icon }) => {
            const radio = getVerticalRadioProps({ value });
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

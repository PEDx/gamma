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
import { logger } from '@/class/Logger';

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
    value: 'flex-start',
    icon: <AlignLeftIcon />,
  },
  {
    value: 'center',
    icon: <AlignCenterIcon />,
  },
  {
    value: 'flex-end',
    icon: <AlignRightIcon />,
  },
];
const verticalOptions = [
  {
    value: 'flex-start',
    icon: <VerticalTopIcon />,
  },
  {
    value: 'center',
    icon: <VerticalCenterIcon />,
  },
  {
    value: 'flex-end',
    icon: <VerticalBottomIcon />,
  },
];

export const FontConfig = forwardRef<
  ConfiguratorComponent<FontConfig>['methods'],
  ConfiguratorComponent<FontConfig>['props']
>(({ onChange }, ref) => {
  console.log('render FontConfig');

  const fontObj = useRef<FontConfig>({
    fontSize: 12,
    fontFamily: 'system-ui',
    lightHeight: 20,
    fontWeight: 'normal',
    letterSpace: 0,
    align: 'center',
    vertical: 'top',
  });

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
        fontObj.current.align = value;
        updata();
      },
    });

  const { getRadioProps: getVerticalRadioProps, setValue: setVerticalValue } =
    useRadioGroup({
      name: 'vertical',
      defaultValue: 'top',
      onChange: (value) => {
        fontObj.current.vertical = value;
        updata();
      },
    });

  const [fontFamilyValue, setFontFamilyValue] = useState(rootFontFamily);
  const [fontWeightValue, setFontWeightValue] = useState(fontWeightList[0]);
  const [fontFamilyList, setFontFamilyList] = useState<Font[]>([]);

  const updata = useCallback(() => {
    onChange({ ...fontObj.current });
  }, []);

  useEffect(() => {
    const promiseList: Promise<boolean>[] = [];
    const arrFont = fontMap['OS X'].concat(fontMap['windows']);
    logger.info('init font family');
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
        fontObj.current = { ...font };
        setAlignValue(font.align);
        setVerticalValue(font.vertical);
        fontSizeRef.current?.setValue(font.fontSize);
        lightHeightRef.current?.setValue(font.lightHeight);
        letterSpaceRef.current?.setValue(font.letterSpace);
        setFontFamilyValue(font.fontFamily);
        setFontWeightValue(font.fontWeight);
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
            fontObj.current.fontFamily = value;
            setFontFamilyValue(value);
            updata();
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
              fontObj.current.fontSize = value;
              updata();
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
                fontObj.current.fontWeight = value;
                setFontWeightValue(value);
                updata();
              }}
            >
              {fontWeightList.map((weight, idx) => (
                <option value={`${weight}`} key={idx}>
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
              fontObj.current.lightHeight = value;
              updata();
            }}
          />
        </Flex>
        <Flex w="50%" alignItems="center" justifyContent="center">
          <LetterSpaceIcon mr="4px" />
          <NumberInput
            ref={letterSpaceRef}
            onChange={(value) => {
              fontObj.current.letterSpace = value;
              updata();
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

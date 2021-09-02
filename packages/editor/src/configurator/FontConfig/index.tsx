import {
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { Box, Select, Flex, useRadioGroup, HStack } from '@chakra-ui/react';
import {
  ConfiguratorComponent,
  IFontConfig,
  StringOrNumber,
} from '@gamma/runtime';
import { Icon } from '@/icons';
import { NumberInput } from '@/configurator/NumberInput';
import { RadioTag } from '@/components/RadioTag';
import { fontMap, isSupportFontFamily, Font, rootFontFamily } from './font';
import { logger } from '@/core/Logger';

const fontWeightList = ['normal', 'bold', 'bolder', 'lighter'];
const alignOptions = [
  {
    value: 'flex-start',
    icon: <Icon name="align-left" />,
  },
  {
    value: 'center',
    icon: <Icon name="align-center" />,
  },
  {
    value: 'flex-end',
    icon: <Icon name="align-right" />,
  },
];
const verticalOptions = [
  {
    value: 'flex-start',
    icon: <Icon name="align-top" />,
  },
  {
    value: 'center',
    icon: <Icon name="align-vertically" />,
  },
  {
    value: 'flex-end',
    icon: <Icon name="align-bottom" />,
  },
];

let fontList: Font[] = [];

export const FontConfig = forwardRef<
  ConfiguratorComponent<IFontConfig>['methods'],
  ConfiguratorComponent<IFontConfig>['props']
>(({ onChange }, ref) => {
  console.log('render FontConfig');

  const fontObj = useRef<IFontConfig>({
    fontSize: 12,
    fontFamily: 'system-ui',
    lightHeight: 20,
    fontWeight: 'normal',
    letterSpace: 0,
    align: 'center',
    vertical: 'top',
  });

  const fontSizeRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const lightHeightRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);
  const letterSpaceRef = useRef<
    ConfiguratorComponent<StringOrNumber>['methods'] | null
  >(null);

  const { getRadioProps: getAlighRadioProps, setValue: setAlignValue } =
    useRadioGroup({
      name: 'align',
      defaultValue: 'left',
      onChange: (value) => {
        fontObj.current.align = value;
        update();
      },
    });

  const { getRadioProps: getVerticalRadioProps, setValue: setVerticalValue } =
    useRadioGroup({
      name: 'vertical',
      defaultValue: 'top',
      onChange: (value) => {
        fontObj.current.vertical = value;
        update();
      },
    });

  const [fontFamilyValue, setFontFamilyValue] = useState(rootFontFamily);
  const [fontWeightValue, setFontWeightValue] = useState(fontWeightList[0]);
  const [fontFamilyList, setFontFamilyList] = useState<Font[]>([]);

  const update = useCallback(() => {
    onChange({ ...fontObj.current });
  }, []);

  useEffect(() => {
    const promiseList: Promise<boolean>[] = [];
    const arrFont = fontMap['OS X'].concat(fontMap['windows']);
    logger.debug('init font family');

    if (fontList.length) {
      logger.debug('fontList from cache');
      setFontFamilyList(fontList);
      return;
    }

    arrFont.forEach((font) => {
      const fontFamily = font.en;
      promiseList.push(isSupportFontFamily(fontFamily));
    });
    // FIXME 快速切换后会导致此报内存泄露警告
    Promise.all(promiseList).then((bols) => {
      const arr: Font[] = [];
      arrFont.forEach((font, idx) => {
        if (bols[idx]) arr.push(font);
      });
      fontList = arr;
      setFontFamilyList(arr);
    });
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (font) => {
        if (!font) return;
        fontObj.current = font;
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
      <Box mb="12px">
        <Select
          value={fontFamilyValue}
          onChange={(event) => {
            const value = event.target.value;
            fontObj.current.fontFamily = value;
            setFontFamilyValue(value);
            update();
          }}
        >
          {fontFamilyList.map((font, idx) => (
            <option value={`"${font.en}"`} key={idx}>
              {font.ch}
            </option>
          ))}
        </Select>
      </Box>
      <Flex mb="12px">
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <Icon name="font-size" mr="4px" />
          <NumberInput
            ref={fontSizeRef}
            onChange={(value) => {
              fontObj.current.fontSize = value;
              update();
            }}
          />
        </Flex>
        <Flex w="50%" alignItems="center" justifyContent="center">
          <Icon name="bold" mr="4px" />
          <Box flex="1">
            <Select
              mr="8px"
              value={fontWeightValue}
              onChange={(event) => {
                const value = event.target.value;
                fontObj.current.fontWeight = value;
                setFontWeightValue(value);
                update();
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
      <Flex mb="12px">
        <Flex w="50%" mr="8px" alignItems="center" justifyContent="center">
          <Icon name="line-height" mr="4px" />
          <NumberInput
            ref={lightHeightRef}
            onChange={(value) => {
              fontObj.current.lightHeight = value;
              update();
            }}
          />
        </Flex>
        <Flex w="50%" alignItems="center" justifyContent="center">
          <Icon name="text-spacing" mr="4px" />
          <NumberInput
            ref={letterSpaceRef}
            onChange={(value) => {
              fontObj.current.letterSpace = value;
              update();
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

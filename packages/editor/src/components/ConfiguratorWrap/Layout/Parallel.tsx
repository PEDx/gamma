import { Configurator } from '@gamma/runtime';
import { HStack, Box } from '@chakra-ui/react';
import { FC } from 'react';
import { ConfiguratorWrap } from '..';
import { LeftRight } from './LeftRight';

function arrTrans<T>(num: number, arr: T[]) {
  const iconsArr: T[][] = [];
  arr.forEach((item, index) => {
    const page = Math.floor(index / num);
    if (!iconsArr[page]) {
      iconsArr[page] = [];
    }
    iconsArr[page].push(item);
  });
  return iconsArr;
}

export interface GroupWrapProps {
  configuratorArray: Configurator<unknown>[];
}

/**
 * 多个并列布局
 */
export const Parallel: FC<GroupWrapProps> = ({ configuratorArray }) => {
  if (configuratorArray.length === 1) {
    const configurator = configuratorArray[0];
    return (
      <LeftRight
        key={`${configurator.type}`}
        configurator={configurator}
      />
    );
  }
  const twoPageArr = arrTrans(2, configuratorArray);
  return (
    <>
      {twoPageArr.map((configuratorArr, idx) => {
        return (
          <HStack spacing="8px" mb="8px" key={idx}>
            {configuratorArr.map((configurator, idx2) => {
              return (
                <HStack spacing="2px" key={`${idx}-${idx2}`}>
                  <Box opacity="0.6" w="12px" textAlign="center">
                    {configurator.lable}
                  </Box>
                  <Box flex="1">
                    <ConfiguratorWrap configurator={configurator} />
                  </Box>
                </HStack>
              );
            })}
          </HStack>
        );
      })}
    </>
  );
};

import { Box, HStack } from '@chakra-ui/react';
import { Configurator, ConfiguratorComponent } from '@/class/Configurator';
import { createElement, FC, useCallback, useRef } from 'react';
import { debounce } from 'lodash';
import { globalBus } from '@/commom/Event';

export interface GroupWrapProps {
  configuratorArray: Configurator<unknown>[];
}

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

export function GroupWrap({ configuratorArray }: GroupWrapProps) {
  //   const instanceArr = useRef<ConfiguratorComponent<unknown>['methods'][]>([]);
  const twoPageArr = arrTrans(2, configuratorArray);

  const change = useCallback(
    debounce((configurator, value) => {
      configurator.setValue(value);
      globalBus.emit('push-viewdata-snapshot-command');
    }, 50),
    [],
  );

  const handleKeyup = useCallback((e) => {
    if (e.keyCode === 13) e.target?.blur();
  }, []);

  return (
    <Box onKeyUp={handleKeyup}>
      {twoPageArr.map((configuratorArr, idx) => {
        return (
          <HStack spacing="8px" mb="8px" key={idx}>
            {configuratorArr.map((configurator, idx2) => {
              const component = configurator.component;
              return (
                <HStack spacing="2px" key={`${idx}-${idx2}`}>
                  <Box opacity="0.6" w="12px" textAlign="center">
                    {configurator.lable}
                  </Box>
                  <Box flex="1">
                    {component
                      ? createElement<
                          ConfiguratorComponent<unknown>['props'] &
                            React.RefAttributes<
                              ConfiguratorComponent<unknown>['methods']
                            >
                        >(component, {
                          ref: (ref) => {
                            if (!ref) return;
                          },
                          onChange: (value) => change(configurator, value),
                          config: configurator.config,
                        })
                      : null}
                  </Box>
                </HStack>
              );
            })}
          </HStack>
        );
      })}
    </Box>
  );
}

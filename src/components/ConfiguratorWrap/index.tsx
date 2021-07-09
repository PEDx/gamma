import { useEffect, createElement, useRef, useCallback, useMemo } from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Configurator, ConfiguratorComponent } from '@/class/Configurator';
import { ConcreteObserver } from '@/class/Observer';
import { globalBus } from '@/class/Event';
import { clone, debounce, isObject } from 'lodash';
import { logger } from '@/class/Logger';

export interface ConfiguratorWrapProps<K> {
  configurator: Configurator<K>;
}

export function ConfiguratorWrap<T>({
  configurator,
}: ConfiguratorWrapProps<T>) {
  logger.debug('render ConfiguratorWrap');

  const instance = useRef<ConfiguratorComponent<T>['methods'] | null>(null);
  const name = configurator.lable;
  const description = configurator.describe;
  const component = configurator.component;
  useEffect(() => {
    logger.debug('creat ConfiguratorWrap');
    const coc = new ConcreteObserver<Configurator<T>>((s) => {
      let value = s.value;
      if (isObject(value)) {
        value = clone(value);
      }
      instance.current?.setValue(value);
    });
    configurator.attach(coc);
    return () => {
      configurator.detach(coc);
    };
  }, []);

  const change = useCallback(
    debounce((value) => {
      configurator.setValue(value);
      globalBus.emit('push-viewdata-snapshot-command');
    }, 50),
    [configurator],
  );

  const handleKeyup = useCallback((e) => {
    if (e.keyCode === 13) e.target?.blur();
  }, []);

  if (!component) return null;

  return useMemo(
    () => (
      <Flex align="flex-start" mb="16px" onKeyUp={handleKeyup}>
        <Box w="25%" className="text-omit" fontSize={12} h="100%">
          {name}
          {description ? (
            <Tooltip
              label={description}
              fontSize="xs"
              arrowSize={12}
              arrowShadowColor="#eee"
            >
              <QuestionOutlineIcon cursor="pointer" ml="2px" mt="-2px" />
            </Tooltip>
          ) : (
            ''
          )}
        </Box>
        <Box w="75%" pl="8px">
          {createElement<
            ConfiguratorComponent<T>['props'] &
              React.RefAttributes<ConfiguratorComponent<T>['methods']>
          >(component, {
            ref: (ref) => {
              instance.current = ref;
            },
            onChange: change,
            config: configurator.config,
          })}
        </Box>
      </Flex>
    ),
    [configurator],
  );
}

import { useEffect, createElement, useRef, useCallback, useMemo } from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { Configurator, ConfiguratorComponent } from '@/runtime/Configurator';
import { ConcreteObserver } from '@/common/Observer';
import { globalBus } from '@/editor/core/Event';
import { clone, debounce, isObject } from 'lodash';
import { getConfiguratorComponet } from '@/editor/configurator';
import { logger } from '@/common/Logger';
import { IdleComponent } from '../IdleComponent';

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
  const component =
    configurator.component || getConfiguratorComponet(configurator.type);
  useEffect(() => {
    logger.debug('create ConfiguratorWrap');
    const coc = new ConcreteObserver<Configurator<T>>(() => {
      syncConfigurator();
    });
    configurator.attach(coc);
    return () => {
      configurator.detach(coc);
    };
  }, []);

  const syncConfigurator = useCallback(() => {
    let value = configurator.value;
    if (isObject(value)) {
      value = clone(value);
    }
    instance.current?.setValue(value);
    if (configurator.config && instance.current?.setConfig) {
      instance.current?.setConfig(configurator.config);
    }
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

  return (
    <Flex align="flex-start" mb="16px" onKeyUp={handleKeyup} minH="20px">
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
        <IdleComponent onMounted={() => syncConfigurator()}>
          {createElement(component, {
            ref: (ref) => {
              instance.current = ref;
            },
            onChange: change,
          })}
        </IdleComponent>
      </Box>
    </Flex>
  );
}

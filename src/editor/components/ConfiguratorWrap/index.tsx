import { useEffect, createElement, useRef, useCallback, useMemo } from 'react';
import { Box, Flex, Tooltip } from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Configurator,
  ConfiguratorComponent,
  ConfiguratorValueType,
} from '@/runtime/Configurator';
import { ConcreteObserver } from '@/common/Observer';
import { clone, debounce, isObject } from 'lodash';
import { getConfiguratorComponet } from '@/editor/configurator';
import { logger } from '@/common/Logger';
import { IdleComponent } from '@/editor/components/IdleComponent';
import { safeEventBus, SafeEventType } from '@/editor/events';

export interface ConfiguratorWrapProps<K> {
  configurator: Configurator<K>;
  layout?: ConfiguratorLayoutType;
}

export enum ConfiguratorLayoutType {
  leftRight, // 正常的左右布局
  topDown, // 上下布局
  noneLabel, // 无说明文本
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

  const layout =
    configurator.type === ConfiguratorValueType.RichText
      ? ConfiguratorLayoutType.noneLabel
      : ConfiguratorLayoutType.leftRight;

  useEffect(() => {
    const coc = new ConcreteObserver<Configurator<T>>(() => {
      syncConfigurator();
    });
    configurator.attach(coc);
    return () => {
      configurator.detach(coc);
    };
  }, [configurator]);

  useEffect(() => {
    logger.debug('create ConfiguratorWrap');
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
  }, [configurator]);

  const change = useCallback(
    debounce((value: T, snapchat = true) => {
      if (isObject(value)) {
        value = clone(value);
      }
      configurator.setValue(value);
      if (snapchat)
        safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
    }, 50),
    [configurator],
  );

  const handleKeyup = useCallback((e) => {
    if (e.keyCode === 13) e.target?.blur();
  }, []);

  if (!component) return null;

  return useMemo(
    () => (
      <Flex align="flex-start" mb="16px" onKeyUp={handleKeyup} minH="20px">
        <Box
          w="25%"
          className="text-omit"
          fontSize={12}
          h="100%"
          title={name}
          display={
            layout === ConfiguratorLayoutType.noneLabel ? 'none' : 'block'
          }
        >
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
        <Box
          w={layout === ConfiguratorLayoutType.noneLabel ? '100%' : '75%'}
          pl={layout === ConfiguratorLayoutType.noneLabel ? '0px' : '8px'}
        >
          <IdleComponent onMounted={() => syncConfigurator()}>
            {createElement(component, {
              ref: (ref) => {
                instance.current = ref;
              },
              onChange: change,
              value: configurator.value,
            })}
          </IdleComponent>
        </Box>
      </Flex>
    ),
    [configurator],
  );
}

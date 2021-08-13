import { useEffect, createElement, useRef, useCallback, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import {
  Configurator,
  ConfiguratorComponent,
  LayoutConfiguratorValueType,
} from '@/runtime/Configurator';
import { ConcreteObserver } from '@/common/Observer';
import { clone, debounce, isObject } from 'lodash';
import { getConfiguratorComponet } from '@/editor/configurator';
import { logger } from '@/common/Logger';
import { IdleComponent } from '@/editor/components/IdleComponent';
import { safeEventBus, SafeEventType } from '@/editor/events';

export interface ConfiguratorWrapProps<K> {
  configurator: Configurator<K>;
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
  const component =
    configurator.component || getConfiguratorComponet(configurator.type);

  useEffect(() => {
    if (!LayoutConfiguratorValueType.includes(configurator.type)) return;
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

  if (!component) return null;

  return useMemo(
    () => (
      <IdleComponent onMounted={() => syncConfigurator()}>
        {createElement(component, {
          ref: (ref) => {
            instance.current = ref;
          },
          onChange: change,
          value: configurator.value,
        })}
      </IdleComponent>
    ),
    [configurator],
  );
}

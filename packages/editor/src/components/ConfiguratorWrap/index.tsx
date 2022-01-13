import { useEffect, createElement, useRef, useCallback, useMemo } from 'react';
import {
  Configurator,
  ConfiguratorComponent,
  Observer,
} from '@gamma/runtime';
import { clone, isObject } from 'lodash';
import { getConfiguratorComponet } from '@/configurator';
import { logger } from '@/core/Logger';
import { IdleComponent } from '@/components/IdleComponent';
import { safeEventBus, SafeEventType } from '@/events';

export interface ConfiguratorWrapProps<K> {
  configurator: Configurator<K>;
}

export function ConfiguratorWrap<T>({
  configurator,
}: ConfiguratorWrapProps<T>) {
  logger.debug('render ConfiguratorWrap');

  const instance = useRef<ConfiguratorComponent<T>['methods'] | null>(null);
  const component =
    configurator.component || getConfiguratorComponet(configurator.type);

  useEffect(() => {
    // 与配置器双向绑定
    const coc = new Observer<Configurator<T>>(() => {
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
    (value: T, snapchat = true) => {
      if (isObject(value)) {
        value = clone(value);
      }

      configurator.setValue(value);
      if (snapchat)
        safeEventBus.emit(SafeEventType.PUSH_VIEWDATA_SNAPSHOT_COMMAND);
    },
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
          config: configurator.config,
        })}
      </IdleComponent>
    ),
    [configurator],
  );
}

import { NumberInput } from '@/configurator/NumberInput';
import { activeNodeManager } from '@/core/ActiveNodeManager';
import { computeKey } from '@/core/ConfiguratorManager';
import { useForceRender } from '@/hooks/useForceRender';
import { ConcreteObserver, Configurator } from '@gamma/runtime';
import { ValueEntity } from '@gamma/runtime/src/values/ValueEntity';
import { useEffect, FC } from 'react';

const ConfiguratorView = ({
  configurator,
}: {
  configurator: Configurator<ValueEntity<unknown>>;
}) => {
  const render = useForceRender();

  useEffect(() => {
    const observer = new ConcreteObserver(render);
    configurator.attach(observer);
    return () => {
      configurator.detach(observer);
    };
  }, [configurator]);

  if (!configurator.lable) return null;
  return (
    <div>
      <NumberInput />
      {configurator.lable}: {JSON.stringify(configurator.value as string)}
    </div>
  );
};

export const StylePanel: FC = () => {
  const render = useForceRender();

  useEffect(() => {
    activeNodeManager.onActive(render);
  }, []);

  if (!activeNodeManager.isActive()) return null;

  const configurators = activeNodeManager.getNodeConfigurators();

  return (
    <div>
      {Object.values(configurators).map((configurator) => {
        return (
          <ConfiguratorView
            configurator={configurator}
            /**
             * 复用同种类型的配置器视图
             */
            key={computeKey(configurator.type)}
          />
        );
      })}
    </div>
  );
};

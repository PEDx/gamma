import { activeNodeManager } from '@/core/ActiveNodeManager';
import { computeKey } from '@/core/ConfiguratorManager';
import { useForceRender } from '@/hooks/useForceRender';
import { Configurator } from '@gamma/runtime';
import { ValueEntity } from '@gamma/runtime/src/values/ValueEntity';
import { useEffect, FC } from 'react';

const DemoDiv = ({
  configurator,
}: {
  configurator: Configurator<ValueEntity<unknown>>;
}) => {
  useEffect(() => {}, []);
  if (!configurator.lable) return null;
  return (
    <div>
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
          <DemoDiv
            configurator={configurator}
            key={computeKey(configurator.type)}
          />
        );
      })}
    </div>
  );
};

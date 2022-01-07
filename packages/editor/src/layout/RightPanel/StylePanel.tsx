import { ConfiguratorView } from '@/configurator';
import { activeNodeManager } from '@/core/ActiveNodeManager';
import { computeKey } from '@/core/ConfiguratorManager';
import { useForceRender } from '@/hooks/useForceRender';
import { useEffect, FC } from 'react';

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

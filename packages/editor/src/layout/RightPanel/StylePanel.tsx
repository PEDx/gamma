import { ConfiguratorView } from '@/configurator';
import { activeNodeManager } from '@/core/ActiveNodeManager';
import { computeKey } from '@/core/ConfiguratorManager';
import { useForceRender } from '@/hooks/useForceRender';
import { Box, Button } from '@chakra-ui/react';
import { useEffect, FC, useCallback } from 'react';
import { nodeHelper } from '@gamma/runtime';

export const StylePanel: FC = () => {
  const render = useForceRender();

  useEffect(() => {
    activeNodeManager.onActive(render);
  }, []);

  const handleDeleteClick = useCallback(() => {
    activeNodeManager.removeSelf();
  }, []);

  if (!activeNodeManager.isActive()) return null;

  const configurators = activeNodeManager.getNodeConfigurators();

  return (
    <>
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
      <Box mt="20px">
        <Button size="xs" w="100%" onClick={handleDeleteClick}>
          删除
        </Button>
      </Box>
    </>
  );
};

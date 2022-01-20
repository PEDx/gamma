import { ConfiguratorView } from '@/configurator';
import { computeKey } from '@/core/ConfiguratorManager';
import { useForceRender } from '@/hooks/useForceRender';
import { Box, Button } from '@chakra-ui/react';
import { useEffect, FC, useCallback } from 'react';
import { Editor } from '@/core/Editor';

export const StylePanel: FC = () => {
  const render = useForceRender();

  useEffect(() => {
    Editor.selector.onSelect(render);
  }, []);

  const handleDeleteClick = useCallback(() => {
    Editor.selector.removeSelf();
  }, []);

  if (!Editor.selector.isSelected()) return null;

  const configurators = Editor.selector.getNodeConfigurators();

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

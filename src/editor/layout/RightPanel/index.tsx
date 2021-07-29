import { FC, useCallback, useEffect, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/editor/components/ConfiguratorWrap';
import { useEditorState, useEditorDispatch } from '@/editor/store/editor';
import { FoldPanel } from '@/editor/components/FoldPanel';
import { commandHistory } from '@/editor/core/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { logger } from '@/common/Logger';

export const RightPanel: FC = () => {
  const { activeViewData } = useEditorState();
  const dispatch = useEditorDispatch();

  const handleDeleteClick = useCallback(() => {
    if (!activeViewData) return;
    if (!dispatch) return;
    commandHistory.push(new DeleteWidgetCommand(activeViewData.id));
  }, [activeViewData, dispatch]);

  const handleFunctionClick = useCallback(() => {
    console.log(activeViewData);
  }, [activeViewData]);

  return useMemo(() => {
    if (!activeViewData) return null;
    const keys = Object.keys(activeViewData.configurators);
    const option = {
      title: '控制',
      component: (
        <Box p="8px">
          <div className="configurator-list">
            {keys.map((key) => {
              const configurator = activeViewData.configurators[key]
              if (configurator.hidden) return null;
              return (
                <ConfiguratorWrap
                  key={`${configurator.type}-${key}`}
                  configurator={configurator}
                />
              );
            })}
          </div>
          <Button size="xs" mt="8px" width="100%" onClick={handleDeleteClick}>
            删除
          </Button>
          <Button size="xs" mt="8px" width="100%" onClick={handleFunctionClick}>
            功能
          </Button>
        </Box>
      ),
    };
    return <FoldPanel panelList={[option]} name="right_panel" />;
  }, [activeViewData]);
};

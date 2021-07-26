import { FC, useCallback, useEffect, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/editor/views/ConfiguratorWrap';
import { useEditorState, useEditorDispatch } from '@/editor/store/editor';
import { FoldPanel } from '@/editor/views/FoldPanel';
import { commandHistory } from '@/editor/core/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { logger } from '@/common/Logger';
import { ConfiguratorMap } from '@/runtime/CreationView';

function SortingConfigurator(configurators: ConfiguratorMap) {}

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
    return (
      <FoldPanel
        panelList={[
          {
            title: '控制',
            component: (
              <Box p="8px">
                <div className="configurator-list">
                  {Object.values(activeViewData.configurators).map(
                    (ctor, idx) => {
                      if (ctor.hidden) return null;
                      return (
                        <ConfiguratorWrap
                          key={`${activeViewData.id}${idx}`}
                          configurator={ctor}
                        />
                      );
                    },
                  )}
                </div>
                {activeViewData && (
                  <>
                    <Button
                      size="xs"
                      mt="8px"
                      width="100%"
                      onClick={handleDeleteClick}
                    >
                      删除
                    </Button>
                    <Button
                      size="xs"
                      mt="8px"
                      width="100%"
                      onClick={handleFunctionClick}
                    >
                      功能
                    </Button>
                  </>
                )}
              </Box>
            ),
          },
        ]}
        name="right_panel"
      />
    );
  }, [activeViewData]);
};

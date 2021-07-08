import { FC, useCallback, useEffect, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { useEditorState, useEditorDispatch } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';
import { commandHistory } from '@/class/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { logger } from '@/class/Logger';

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

  return useMemo(
    () => (
      <FoldPanel
        panelList={[
          {
            title: '控制',
            component: (
              <Box p="8px" pt="18px">
                <div className="configurator">
                  {activeViewData &&
                    // TODO 实现展示视图布局
                    Object.values(activeViewData.configurators).map(
                      (ctor, idx) => {
                        if (ctor.hidden) return null;
                        const component = ctor.component;
                        if (!component) return null;
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
    ),
    [activeViewData],
  );
};

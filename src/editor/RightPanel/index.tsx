import { FC, useCallback } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';
import { commandHistory } from '@/class/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { ConfiguratorValueType } from '@/class/Configurator';

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

  return (
    <FoldPanel
      panelList={[
        {
          title: '控制',
          component: (
            <Box p="8px" pt="18px">
              <div className="configurator">
                {activeViewData &&
                  Object.values(activeViewData.configurators).map(
                    (ctor, idx) => {
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
                  {!activeViewData.isRoot && (
                    <Button
                      size="xs"
                      mt="8px"
                      width="100%"
                      onClick={handleDeleteClick}
                    >
                      删除
                    </Button>
                  )}
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
};

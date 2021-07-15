import { FC, useCallback, useEffect, useMemo } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/editor/views/ConfiguratorWrap';
import { useEditorState, useEditorDispatch } from '@/editor/store/editor';
import { FoldPanel } from '@/editor/views/FoldPanel';
import { commandHistory } from '@/editor/core/CommandHistory';
import { DeleteWidgetCommand } from '@/editor/commands';
import { logger } from '@/common/Logger';

import { ConfiguratorValueType } from '@/runtime/Configurator';

const groupConfiguratorType = [
  ConfiguratorValueType.X,
  ConfiguratorValueType.Y,
  ConfiguratorValueType.Width,
  ConfiguratorValueType.Height,
];

export const RightPanel: FC = () => {
  const { activeViewData } = useEditorState();
  const dispatch = useEditorDispatch();

  const editableConfiguratorArr = Object.values(
    activeViewData?.editableConfigurators || {},
  );

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
              <Box p="8px">
                {/*  FIXME 耗时渲染 */}
                <div className="configurator-list">
                  {activeViewData &&
                    Object.values(activeViewData.configurators).map(
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
                {/*  FIXME 耗时渲染 */}
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

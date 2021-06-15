import { FC, useCallback } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';

export const RightPanel: FC = () => {
  const state = useEditorState();
  const dispatch = useEditorDispatch();
  const selectViewData = state!.selectViewData;
  const handleDeleteClick = useCallback(() => {
    selectViewData?.removeSelfFromParent();
    dispatch!({
      type: ActionType.SetSelectViewData,
      data: null,
    });
  }, [dispatch]);

  return (
    <FoldPanel
      panelList={[
        {
          title: '控制',
          component: (
            <Box p="8px" pt="18px">
              <div className="configurator">
                {selectViewData &&
                  selectViewData.configurators.map((ctor) => {
                    const component = ctor.component;
                    if (!component) return null;
                    return (
                      <ConfiguratorWrap
                        key={`${selectViewData.id}${ctor.name}`}
                        configurator={ctor}
                      />
                    );
                  })}
              </div>
              {selectViewData && (
                <Button
                  size="xs"
                  mt="8px"
                  width="100%"
                  onClick={handleDeleteClick}
                >
                  删除
                </Button>
              )}
            </Box>
          ),
        },
      ]}
      name="right_panel"
    />
  );
};

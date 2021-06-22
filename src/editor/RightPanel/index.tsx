import { FC, useCallback } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';

export const RightPanel: FC = () => {
  const { selectViewData } = useEditorState();
  const dispatch = useEditorDispatch();

  const handleDeleteClick = useCallback(() => {
    selectViewData?.removeSelfFromParent();
    dispatch!({
      type: ActionType.SetSelectViewData,
      data: null,
    });
  }, [selectViewData, dispatch]);

  const handleFunctionClick = useCallback(() => {
    console.log(selectViewData);
  }, [selectViewData]);

  return (
    <FoldPanel
      panelList={[
        {
          title: '控制',
          component: (
            <Box p="8px" pt="18px">
              <div className="configurator">
                {selectViewData &&
                  Object.keys(selectViewData.configurators).map((key, idx) => {
                    const ctor = selectViewData.configurators[key];
                    const component = ctor.component;
                    if (!component) return null;
                    return (
                      <ConfiguratorWrap
                        key={`${selectViewData.id}${idx}`}
                        configurator={ctor}
                      />
                    );
                  })}
              </div>
              {selectViewData && (
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
};

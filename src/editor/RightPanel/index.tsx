import { FC, useCallback } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { PickConfiguratorValueType } from '@/class/Configurator';
import { useEditorState, useEditorDispatch, ActionType } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';

export const RightPanel: FC = () => {
  const { selectViewData } = useEditorState();
  const dispatch = useEditorDispatch();

  const handleDeleteClick = useCallback(() => {
    selectViewData?.removeSelfFromParentContainer();
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
                  Object.values(selectViewData.configurators).map(
                    (ctor, idx) => {
                      const component = ctor.component;
                      if (!component) return null;
                      return (
                        <ConfiguratorWrap<
                          PickConfiguratorValueType<typeof ctor>
                        >
                          key={`${selectViewData.id}${idx}`}
                          configurator={ctor}
                        />
                      );
                    },
                  )}
              </div>
              {selectViewData && (
                <>
                  {!selectViewData.isRoot && (
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

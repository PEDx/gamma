import { useEffect, FC, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { ConfiguratorWrap } from '@/components/ConfiguratorWrap';
import { EditorContext } from '@/store/editor';
import { FoldPanel } from '@/components/FoldPanel';

export const RightPanel: FC = () => {
  const { state } = useContext(EditorContext) || {};
  const selectViewData = state!.select_view_data;
  return (
    <FoldPanel
      panelList={[
        {
          title: '控制',
          component: () => (
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
            </Box>
          ),
        },
      ]}
      name="right_panel"
    />
  );
};

import { useMemo, useCallback, FC, useRef, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { DragSource } from '@/components/DragSource';
import { Configurator } from '@/class/Configurator';
import {
  createBox,
  createText,
  createImage,
  attachViewData,
} from '@/prototype/widget';
import { FoldPanel } from '@/components/FoldPanel';
import { EditorContext } from '@/store/editor';

interface dragType {
  [key: string]: () => [HTMLElement, Configurator[]];
}

const drag_type_map: dragType = {
  '1': createBox,
  '2': createText,
  '3': createImage,
};

export const LeftPanel: FC = () => {
  const { state } = useContext(EditorContext) || {};

  const handleDrop = useCallback((container, type, e) => {
    const [element, configurators] = drag_type_map[type]();
    const vd = attachViewData(container, element, configurators);
    vd.editableConfigurators?.x?.setDefaultValue(e.offsetX);
    vd.editableConfigurators?.y?.setDefaultValue(e.offsetY);
    vd.initViewByConfigurators();
  }, []);

  return useMemo(
    () => (
      <FoldPanel
        panelList={[
          {
            title: '组件',
            component: () => (
              <Box>
                <DragSource
                  dragDestination={state!.drag_destination}
                  drop={handleDrop}
                />
              </Box>
            ),
          },
          {
            title: '资源',
            component: () => <Box></Box>,
          },
        ]}
        name="left_panel"
      />
    ),
    [state!.drag_destination],
  );
};

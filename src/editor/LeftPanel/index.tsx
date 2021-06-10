import { useMemo, useCallback, FC, useRef, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { DragSource } from '@/components/DragSource';
import { viewTypeMap, attachViewData } from '@/packages';
import { FoldPanel } from '@/components/FoldPanel';
import { EditorContext } from '@/store/editor';

export const LeftPanel: FC = () => {
  const { state } = useContext(EditorContext) || {};

  const handleDrop = useCallback(
    (container: Element, type: number, e: DragEvent) => {
      const createView = viewTypeMap.get(type);
      if (!createView) return;
      const [element, configurators] = createView();
      const vd = attachViewData(container, element, configurators);
      vd.editableConfigurators?.x?.setDefaultValue(e.offsetX);
      vd.editableConfigurators?.y?.setDefaultValue(e.offsetY);
      vd.initViewByConfigurators();
    },
    [],
  );

  return useMemo(
    () => (
      <FoldPanel
        panelList={[
          {
            title: '组件',
            component: () => (
              <DragSource
                dragDestination={state!.drag_destination}
                drop={handleDrop}
              />
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
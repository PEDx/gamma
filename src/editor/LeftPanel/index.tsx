import { useMemo, useCallback, FC, useRef, useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { WidgetSource } from '@/components/WidgetSource';
import { viewTypeMap, attachViewData } from '@/packages';
import { FoldPanel } from '@/components/FoldPanel';
import { ResourceManager } from '@/components/ResourceManager';
import { EditorContext } from '@/store/editor';

export const LeftPanel: FC = () => {
  console.log('render LeftPanel');

  const { state } = useContext(EditorContext) || {};

  const handleDrop = useCallback(
    (container: Element, type: number, e: DragEvent) => {
      const createView = viewTypeMap.get(type);
      if (!createView) return;
      const [element, configurators] = createView();
      // ANCHOR 此处插入组件到父组件中
      const vd = attachViewData(container, element, configurators);
      vd.editableConfigurators?.x?.setDefaultValue(e.offsetX);
      vd.editableConfigurators?.y?.setDefaultValue(e.offsetY);
      vd.initViewByConfigurators();
    },
    [],
  );

  return (
    <FoldPanel
      panelList={[
        {
          title: '组件',
          component: (
            <WidgetSource
              dragDestination={state!.drag_destination}
              drop={handleDrop}
            />
          ),
        },
        {
          title: '资源',
          component: <ResourceManager />,
        },
      ]}
      name="left_panel"
    />
  );
};

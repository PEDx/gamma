import { FC } from 'react';
import { WidgetSource } from '@/editor/views/WidgetSource';
import { FoldPanel } from '@/editor/components/FoldPanel';
import { ResourceManager } from '@/editor/views/ResourceManager';

export const LeftPanel: FC = () => {
  return (
    <FoldPanel
      panelList={[
        {
          title: '组件',
          component: <WidgetSource />,
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

import { FC } from 'react';
import { WidgetSource } from '@/views/WidgetSource';
import { FoldPanel } from '@/components/FoldPanel';
import { ResourceManager } from '@/views/ResourceManager';

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

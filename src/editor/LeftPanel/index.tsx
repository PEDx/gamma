import { FC, useRef, useContext } from 'react';
import { WidgetSource } from '@/components/WidgetSource';
import { FoldPanel } from '@/components/FoldPanel';
import { ResourceManager } from '@/components/ResourceManager';

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

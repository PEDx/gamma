import { FC } from 'react';
import { ElementSource } from '@/views/function/ElementSource';
import { FoldPanel } from '@/views/components/FoldPanel';
import { ResourceManager } from '@/views/function/ResourceManager';

export const LeftPanel: FC = () => {
  return (
    <FoldPanel
      panelList={[
        {
          title: '组件',
          component: <ElementSource />,
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

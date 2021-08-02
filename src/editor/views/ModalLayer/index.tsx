import { globalBus } from '@/editor/core/Event';
import { useState, FC } from 'react';
import { LayoutModeChoose } from './LayoutModeChoose';

export const ModalLayer: FC = () => {
  const [layoutModeChooseVisible, setLayoutModeChooseVisible] = useState(false);
  globalBus.on('layout-visible', (bol: boolean) => {
    setLayoutModeChooseVisible(bol);
  });
  return (
    <>
      <LayoutModeChoose visible={layoutModeChooseVisible} />
    </>
  );
};

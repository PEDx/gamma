import { safeEventBus, SafeEventType } from '@/editor/events';
import { useState, FC, useEffect } from 'react';
import { LayoutModeChoose } from './LayoutModeChoose';

export const ModalLayer: FC = () => {
  const [layoutModeChooseVisible, setLayoutModeChooseVisible] = useState(false);

  useEffect(() => {
    safeEventBus.on(SafeEventType.SET_LAYOUT_MODAL_VISIBLE, (bol) => {
      setLayoutModeChooseVisible(bol)
    }
    );
  }, []);

  return (
    <>
      <LayoutModeChoose visible={layoutModeChooseVisible} />
    </>
  );
};

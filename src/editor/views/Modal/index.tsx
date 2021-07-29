import { useState, FC } from 'react';
import { LayoutModeChoose } from './LayoutModeChoose';

export const ModalLayer: FC = () => {
  const [layoutModeChooseVisible, setLayoutModeChooseVisible] = useState(false);
  return (
    <>
      <LayoutModeChoose visible={layoutModeChooseVisible} />
    </>
  );
};

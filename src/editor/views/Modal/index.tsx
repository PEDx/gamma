import { useState, FC } from 'react';
import { LayoutModeChoose } from './LayoutModeChoose';

export const ModalLayer: FC = () => {
  const [layoutModeChooseVisible, setLayoutModeChooseVisible] = useState(true);
  return (
    <>
      <LayoutModeChoose visible={layoutModeChooseVisible} />
    </>
  );
};

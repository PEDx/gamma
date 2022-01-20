import { useState, FC, useEffect } from 'react';
import { LayoutModeChoose } from './LayoutModeChoose';

export const ModalLayer: FC = () => {
  const [layoutModeChooseVisible, setLayoutModeChooseVisible] = useState(false);

  useEffect(() => {}, []);

  return (
    <>
      <LayoutModeChoose visible={layoutModeChooseVisible} />
    </>
  );
};

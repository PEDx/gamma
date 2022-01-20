import { useRef, useState, useEffect, useMemo, FC, useCallback } from 'react';
import { Input, Box } from '@chakra-ui/react';
import { IConfiguratorComponentProps } from '..';
import { TBackgroundValue } from '@gamma/runtime';
import { ColorPicker } from '../ColorPicker';
import { Select } from '../Select';

export function BackgroundConfig({
  value,
  onChange,
}: IConfiguratorComponentProps<TBackgroundValue>) {
  // 这里拿到的 value 一定是最新选中节点的值

  const color = value.backgroundColor;
  const backgroundSizeOptions = value.backgroundSize;

  const handleColorChange = useCallback(
    (color: TBackgroundValue['backgroundColor']) => {
      onChange({
        ...value,
        backgroundColor: color,
      });
    },
    [value],
  );
  const handleBgsizeChange = useCallback(
    (options: TBackgroundValue['backgroundSize']) => {
      onChange({
        ...value,
        backgroundSize: options,
      });
    },
    [value],
  );
  return (
    <Box>
      <ColorPicker value={color} onChange={handleColorChange} />
      <Select value={backgroundSizeOptions} onChange={handleBgsizeChange} />
    </Box>
  );
}

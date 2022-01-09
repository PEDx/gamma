import { useRef, useState, useEffect, useMemo, FC, useCallback } from 'react';
import { Input, Box } from '@chakra-ui/react';
import { IConfiguratorComponentProps } from '..';
import { TBackgroundValue } from '@gamma/runtime';
import { ColorPicker } from '../ColorPicker';

export function BackgroundConfig({
  value,
  onChange,
}: IConfiguratorComponentProps<TBackgroundValue>) {
  const color = value.backgroundColor;
  const handleColorChange = useCallback(() => {}, []);
  return (
    <Box>
      <ColorPicker value={color} onChange={handleColorChange} />
    </Box>
  );
}

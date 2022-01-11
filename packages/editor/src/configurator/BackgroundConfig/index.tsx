import { useRef, useState, useEffect, useMemo, FC, useCallback } from 'react';
import { Input, Box } from '@chakra-ui/react';
import { IConfiguratorComponentProps } from '..';
import { RGBColor, TBackgroundValue } from '@gamma/runtime';
import { ColorPicker } from '../ColorPicker';
import { Select } from '../Select';

export function BackgroundConfig({
  value,
  onChange,
}: IConfiguratorComponentProps<TBackgroundValue>) {
  const color = value.backgroundColor;
  const backgroundSizeOptions = value.backgroundSize;
  const handleColorChange = useCallback((color: RGBColor) => {
    onChange({
      ...value,
      backgroundColor: color,
    });
  }, []);
  const handleBgsizeChange = useCallback((color) => {}, []);
  return (
    <Box>
      <ColorPicker value={color} onChange={handleColorChange} />
      <Select value={backgroundSizeOptions} onChange={handleBgsizeChange} />
    </Box>
  );
}

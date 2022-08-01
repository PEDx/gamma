import { extendTheme } from '@chakra-ui/react';
import { colors } from './colors';
import { config } from './config';
import { components } from './components';

const _theme = extendTheme({ colors, ...config, components });
_theme.colors.gray['200'] = '#d6d6d6';

Object.values(_theme.components).forEach((comp: any) => {
  if (comp.defaultProps && comp.defaultProps.size) {
    comp.defaultProps.size = 'xs';
  }
});

export const theme: unknown = _theme;

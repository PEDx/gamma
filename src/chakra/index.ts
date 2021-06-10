import { extendTheme } from '@chakra-ui/react';
import colors from './colors';
import config from './config';
import './icon'

const t = extendTheme({ colors, ...config });
t.colors.gray['200'] = '#d6d6d6';

export const theme = t;

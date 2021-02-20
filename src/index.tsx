import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Editor from './editor';
import reportWebVitals from './reportWebVitals';
import colors from './chakra/colors';
import config from './chakra/config';
import './index.scss';

const theme = extendTheme({ colors, ...config });

console.log(theme);

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Editor />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals(console.log);

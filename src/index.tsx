import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Editor from './editor';
import Test from './test';
import reportWebVitals from './reportWebVitals';
import { theme } from './chakra';
import './index.scss';

console.log(theme);

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Test />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

reportWebVitals(console.log);

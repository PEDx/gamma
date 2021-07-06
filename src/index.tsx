import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Editor } from './editor';
import { theme } from './chakra';
import './index.scss';

console.log(theme);

// TODO 需要查一下有没有内存泄露

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

// reportWebVitals(console.log);

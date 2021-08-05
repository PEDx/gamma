import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Editor } from '@/editor';
import { theme } from '@/chakra';
import { PerformanceLog } from '@/common/PerformanceLog';
import 'virtual:svg-icons-register';
import './index.scss';

new PerformanceLog();

console.log(theme);

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

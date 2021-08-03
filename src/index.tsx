import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Editor } from '@/editor';
import { GammaTextEditor } from '@/preview/GammaTextEditor';
import { theme } from '@/chakra';
import { PerformanceLog } from '@/common/PerformanceLog';
import 'virtual:svg-icons-register';
import './index.scss';

new PerformanceLog();

console.log(theme);

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <GammaTextEditor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

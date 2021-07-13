import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Editor } from '@/editor';
import { Comments } from '@/preview/comments';
import { theme } from '@/chakra';
import { PerformanceLog } from '@/commom/PerformanceLog';
import './index.scss';

new PerformanceLog();
console.log(theme);

// TODO 需要查一下有没有内存泄露

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Comments />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

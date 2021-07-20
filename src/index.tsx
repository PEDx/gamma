import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Editor } from '@/editor';
import { Comments } from '@/preview/comments';
import { theme } from '@/chakra';
import { PerformanceLog } from '@/common/PerformanceLog';
import './index.scss';

new PerformanceLog();
console.log(theme);

// TODO 需要查一下有没有内存泄露
// 未解决的问题
// 1. 宽高比锁定
// 2. 在多状态组件中怎样编辑组件多个状态
// 3. 布局组件的顺序调整
// 4. 定位方向可调整

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

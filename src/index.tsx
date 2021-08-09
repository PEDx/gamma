import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Editor } from '@/editor';
import { renderPreview } from '@/preview';
import { theme } from '@/chakra';
import { PerformanceLog } from '@/common/PerformanceLog';
import 'virtual:svg-icons-register';
import './index.scss';

const renderEditor = () =>
  ReactDOM.render(
    <StrictMode>
      <ChakraProvider theme={theme}>
        <Editor />
      </ChakraProvider>
    </StrictMode>,
    document.getElementById('root'),
  );

const simpleRouter = () => {
  const hash = window.location.hash;
  if (hash.indexOf('preview') !== -1) {
    renderPreview();
    return;
  }
  renderEditor();
};

window.onload = () => {
  simpleRouter();
};

new PerformanceLog();

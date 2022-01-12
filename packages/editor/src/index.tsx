import { FC, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { EditorStoreProvider } from '@/store/editor';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/layout/Layout';
import { TopBar } from '@/layout/TopBar';
import { BottomBar } from '@/layout/BottomBar';
import { RightPanel } from '@/layout/RightPanel';
import { LeftPanel } from '@/layout/LeftPanel';
import { Viewport } from '@/layout/Viewport';
import { ModalLayer } from '@/views/ModalLayer';
import { theme } from '@/chakra';
import { ChakraProvider } from '@chakra-ui/react';
import { PerformanceLog } from './core/PerformanceLog';

import 'virtual:svg-icons-register';
import '@/runtime';
import '@/keyboard';
import '@/index.scss';

new PerformanceLog();

export const Editor: FC = () => {
  return (
    <Box className="gamma-editor" h="100%">
      <EditorStoreProvider>
        <Layout
          top={<TopBar />}
          bottom={<BottomBar />}
          left={<LeftPanel />}
          right={<RightPanel />}
          middleBottom={''}
          middleContainer={<Viewport />}
        />
        <ModalLayer />
      </EditorStoreProvider>
    </Box>
  );
};

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme as any}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

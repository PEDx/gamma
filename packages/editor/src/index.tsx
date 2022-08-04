import { FC, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/chakra';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/views/layout/Layout';
import { TopBar } from '@/views/layout/TopBar';
import { Material } from '@/views/editor/Material';
import { Viewport } from '@/views/editor/Viewport';
import { ModalLayer } from '@/views/layer/ModalLayer';
import { PerformanceLog } from '@/core/PerformanceLog';

import './index.scss';
import 'virtual:svg-icons-register';

new PerformanceLog();

export const Editor: FC = () => {
  return (
    <Box className="gamma-editor" h="100%">
      <Layout top={<TopBar />} main={<Viewport />} left={<Material />} />
      <ModalLayer />
    </Box>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
);

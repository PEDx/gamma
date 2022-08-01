import { FC, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/chakra';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/views/layout/Layout';
import { TopBar } from '@/views/layout/TopBar';
import { RightPanel } from '@/views/layout/RightPanel';
import { LeftPanel } from '@/views/layout/LeftPanel';
import { Viewport } from '@/views/layout/Viewport';
import { ModalLayer } from '@/views/layer/ModalLayer';
import './index.scss';

import 'virtual:svg-icons-register';

export const Editor: FC = () => {
  return (
    <Box className="gamma-editor" h="100%">
      <Layout
        top={<TopBar />}
        bottom={''}
        left={<LeftPanel />}
        right={<RightPanel />}
        middleBottom={''}
        middleContainer={<Viewport />}
      />
      <ModalLayer />
    </Box>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ChakraProvider theme={theme as any}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
);

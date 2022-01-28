import { FC, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/layout/Layout';
import { TopBar } from '@/layout/TopBar';
import { RightPanel } from '@/layout/RightPanel';
import { LeftPanel } from '@/layout/LeftPanel';
import { Viewport } from '@/layout/Viewport';
import { ModalLayer } from '@/views/ModalLayer';
import { theme } from '@/chakra';
import { ChakraProvider } from '@chakra-ui/react';

import 'virtual:svg-icons-register';
import '@/index.scss';

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

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme as any}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

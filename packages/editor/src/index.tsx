import { FC, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/chakra';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/views/layout/Layout';
import { TopBar } from '@/views/layout/TopBar';
import { ModalLayer } from '@/views/layer/ModalLayer';
import './index.scss';

import 'virtual:svg-icons-register';

export const Editor: FC = () => {
  return (
    <Box className="gamma-editor" h="100%">
      <Layout top={<TopBar />} />
      <ModalLayer />
    </Box>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <>
    <StrictMode>
      <ChakraProvider theme={theme}>
        <Editor />
      </ChakraProvider>
    </StrictMode>
  </>,
);

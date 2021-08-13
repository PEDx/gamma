import { FC, StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { EditorStoreProvider } from '@/store/editor';
import { SettingPersistStoreProvider } from '@/store/setting';
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
import '@/keyboard';

export const Editor: FC = () => {
  return (
    <Box className="gamma-editor" h="100%">
      <EditorStoreProvider>
        <SettingPersistStoreProvider>
          <Layout
            top={<TopBar />}
            bottom={<BottomBar />}
            left={<LeftPanel />}
            right={<RightPanel />}
            middleBottom={''}
            middleContainer={<Viewport />}
          />
          <ModalLayer />
        </SettingPersistStoreProvider>
      </EditorStoreProvider>
    </Box>
  );
};

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Editor />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

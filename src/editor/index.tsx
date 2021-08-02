import { FC } from 'react';
import { EditorStoreProvider } from '@/editor/store/editor';
import { SettingPersistStoreProvider } from '@/editor/store/setting';
import { Box } from '@chakra-ui/react';
import { Layout } from '@/editor/layout/Layout';
import { TopBar } from '@/editor/layout/TopBar';
import { BottomBar } from '@/editor/layout/BottomBar';
import { RightPanel } from '@/editor/layout/RightPanel';
import { LeftPanel } from '@/editor/layout/LeftPanel';
import { Viewport } from '@/editor/layout/Viewport';
import { ModalLayer } from '@/editor/views/ModalLayer';
import './keyboard';

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

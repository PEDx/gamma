import { FC } from 'react';
import { EditorStoreProvider } from '@/editor/store/editor';
import { SettingPersistStoreProvider } from '@/editor/store/setting';
import { Box } from '@chakra-ui/react';
import { Layout } from './views/Layout';
import { TopBar } from './views/TopBar';
import { BottomBar } from './views/BottomBar';
import { RightPanel } from './views/RightPanel';
import { LeftPanel } from './views/LeftPanel';
import { Viewport } from './views/Viewport';
import './keyboard';

export const Editor: FC = () => {
  return (
    <Box className="editor" h="100%">
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
        </SettingPersistStoreProvider>
      </EditorStoreProvider>
    </Box>
  );
};

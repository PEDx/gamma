import { FC } from 'react';
import { Box } from '@chakra-ui/react';
import { Layout } from './Layout';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { RightPanel } from './RightPanel';
import { LeftPanel } from './LeftPanel';
import { Viewport } from './Viewport';

const Editor: FC = () => {
  return (
    <Box className="editor" h="100%">
      <Layout
        top={<TopBar />}
        bottom={<BottomBar />}
        left={<LeftPanel />}
        right={<RightPanel />}
        middleBottom={''}
        middleContainer={<Viewport />}
      />
    </Box>
  );
};

export default Editor;

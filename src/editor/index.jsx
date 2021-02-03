import { Box } from '@chakra-ui/react';
import Layout from './Layout';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import Viewport from './Viewport';
function Editor() {
  return (
    <Box className="editor" h="100%">
      <Layout
        top={<TopBar />}
        bottom={<BottomBar />}
        middleContainer={<Viewport />}
      />
    </Box>
  );
}

export default Editor;

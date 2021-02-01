import { Box } from '@chakra-ui/react';
import Layout from '@/layout';
import TopBar from '@/components/TopBar/index';
import BottomBar from '@/components/BottomBar/index';
function Editor() {
  return (
    <Box className="Editor" h="100%">
      <Layout topBar={<TopBar />} bottomBar={<BottomBar />} />
    </Box>
  );
}

export default Editor;

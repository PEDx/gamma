import { FC, useReducer } from 'react';
import { reducer, initState, EditorContext } from '@/store/editor';
import { Box } from '@chakra-ui/react';
import { Layout } from './Layout';
import { TopBar } from './TopBar';
import { BottomBar } from './BottomBar';
import { RightPanel } from './RightPanel';
import { LeftPanel } from './LeftPanel';
import { Viewport } from './Viewport';

export function Editor(): FC {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <Box className="editor" h="100%">
      <EditorContext.Provider value={{ dispatch, state }}>
        <Layout
          top={<TopBar />}
          bottom={<BottomBar />}
          left={<LeftPanel />}
          right={<RightPanel />}
          middleBottom={''}
          middleContainer={<Viewport />}
        />
      </EditorContext.Provider>
    </Box>
  );
}

import { useEffect, FC, ReactElement } from 'react';
import { Flex, Box } from '@chakra-ui/react';
import { TriangleUpIcon } from '@chakra-ui/icons';
import { useStorageState } from '@/hooks/useStorageState';

export interface FoldPanel {
  title: string;
  component: ReactElement;
}

export interface FoldPanelProps {
  name: string;
  panelList: FoldPanel[];
}

export const FoldPanel: FC<FoldPanelProps> = ({ name, panelList }) => {
  const [foldArr, setFoldArr] = useStorageState<boolean[]>(
    `fold_panel_${name}`,
    [],
  );
  useEffect(() => {}, []);
  return (
    <Flex className="editor-fold-panel" h="100%" flexDirection="column">
      {panelList.map((panel, idx: number) => (
        <Flex
          key={idx}
          className="panel-item"
          h={foldArr[idx] ? '20px' : 'auto'}
          flex={!foldArr[idx] ? '1' : ''}
          flexDirection="column"
          // transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
          overflowY="hidden"
          overflowX="visible"
        >
          <Box className="panel-item-title" fontSize="12px" cursor="pointer">
            <Box
              as="button"
              height="20px"
              w="100%"
              lineHeight="1.2"
              border="1px"
              px="8px"
              fontSize="12px"
              textAlign="left"
              _hover={{ opacity: '0.8' }}
              _active={{
                opacity: '0.7',
              }}
              _focus={{
                outline: 0,
              }}
              borderColor={'var(--editor-border-color)'}
              bg={'var(--editor-bar-color)'}
              onClick={() => {
                foldArr[idx] = !foldArr[idx];
                setFoldArr([...foldArr]);
              }}
            >
              <TriangleUpIcon
                mt="-1px"
                name="triangle-up"
                transition="transform 0.2s ease"
                transform={foldArr[idx] ? 'rotate(180deg)' : ''}
                mr="4px"
                w="8px"
              />
              {panel.title}
            </Box>
          </Box>
          <Box
            className="panel-item-content"
            flex="1"
            overflowY="auto"
            overflowX="hidden"
          >
            {panel.component}
          </Box>
        </Flex>
      ))}
    </Flex>
  );
};

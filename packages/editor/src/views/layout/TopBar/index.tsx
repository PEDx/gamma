import { useEffect, useRef, FC, useCallback } from 'react';
import {
  Grid,
  Button,
  Box,
  Flex,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useColorMode,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { Icon } from '@/icons';
import { Setting } from './setting';
import { deviceList, ViewportDevice } from '@/utils';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const deviceMap: { [key: string]: ViewportDevice } = {};
deviceList.forEach((device) => (deviceMap[device.id] = device));

export const TopBar: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLDivElement>(null);

  const handleSaveClick = useCallback(() => {}, []);

  const handlePreviewClick = useCallback(() => {}, []);

  useEffect(() => {}, []);
  return (
    <Box h="100%">
      <Flex h="100%" justify="space-between" align="center">
        <Box
          textAlign="left"
          padding="0 16px"
          className="flex-box"
          fontSize="18px"
        >
          <Icon name="gamma" mr="8px" />
          <Box
            h="18px"
            lineHeight="18px"
            color={'var(--editor-main-color)'}
            fontWeight="bold"
            fontSize="15px"
          >
            Gamma
          </Box>
        </Box>
        <Box pr="10px">
          <Tooltip
            label={colorMode === 'light' ? '深色模式' : '浅色模式'}
            fontSize="12px"
            arrowSize={12}
            arrowShadowColor="#eee"
          >
            <IconButton
              variant="ghost"
              aria-label="深色模式"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
          </Tooltip>
          <Button ml="8px">保存</Button>
          <Button ml="8px" onClick={handlePreviewClick}>
            预览
          </Button>
        </Box>
      </Flex>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader fontSize="14px">偏好设置</DrawerHeader>
          <DrawerBody>
            <Setting />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

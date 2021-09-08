import { useEffect, useRef, FC, useCallback } from 'react';
import {
  Grid,
  Button,
  Box,
  Flex,
  Select,
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
import { getSerializeCollection } from '@gamma/runtime';
import { RenderData } from '@gamma/renderer';
import { Icon } from '@/icons';
import { Setting } from './setting';
import { deviceList, ViewportDevice } from '@/utils';
import { MAIN_COLOR } from '@/color';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const deviceMap: { [key: string]: ViewportDevice } = {};
deviceList.forEach((device) => (deviceMap[device.id] = device));

const renderData = new RenderData();

export const TopBar: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLDivElement>(null);

  const handleSaveClick = useCallback(() => {
    renderData.saveRenderDataToLocal(getSerializeCollection());
  }, []);

  const handlePreviewClick = useCallback(() => {}, []);

  useEffect(() => {}, []);
  return (
    <Box h="100%">
      <Grid templateColumns="repeat(5, 1fr)" h="100%">
        <Box
          textAlign="left"
          padding="0 16px"
          className="flex-box"
          fontSize="18px"
        >
          <Icon name="gamma" mr="8px" />
          <Box h="18px" color={MAIN_COLOR} fontWeight="light" fontSize="14px">
            Gamma
          </Box>
        </Box>
        <Box />
        <Flex justify="center" align="center">
          {/* <Select
            size="xs"
            value={viewportDevice?.id}
            onChange={(e) => {
              const _id = e.target.value;
              dispatch({
                type: ActionType.SetViewportDevice,
                data: deviceMap[_id],
              });
            }}
          >
            {deviceList.map((device) => (
              <option
                value={device.id}
                key={device.id}
              >{`${device.label} - ${device.resolution.width}x${device.resolution.height}`}</option>
            ))}
          </Select> */}
        </Flex>
        <Box />
        <Flex justify="flex-end" align="center" pr="10px">
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
              size="xs"
              onClick={toggleColorMode}
            />
          </Tooltip>
          <Button size="xs" ml="8px" onClick={handleSaveClick}>
            保存
          </Button>
          <Button size="xs" ml="8px" onClick={handlePreviewClick}>
            预览
          </Button>
        </Flex>
      </Grid>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton size="xs" />
          <DrawerHeader fontSize="14px">偏好设置</DrawerHeader>
          <DrawerBody>
            <Setting />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

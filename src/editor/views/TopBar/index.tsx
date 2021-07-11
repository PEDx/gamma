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
} from '@chakra-ui/react';
import { ViewData } from '@/runtime/ViewData';
import {
  useSettingDispatch,
  useSettingState,
  ActionType,
} from '@/editor/store/setting';
import { useEditorState } from '@/editor/store/editor';
import { Setting } from './setting';
import { deviceList, storage, ViewportDevice } from '@/utils';
import { MAIN_COLOR } from '@/editor/color';

const deviceMap: { [key: string]: ViewportDevice } = {};
deviceList.forEach((device) => (deviceMap[device.id] = device));

export const TopBar: FC = () => {
  const { layoutViewData } = useEditorState();
  const { viewportDevice } = useSettingState();
  const dispatch = useSettingDispatch();
  const { isOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLDivElement>(null);

  const handleSaveClick = useCallback(() => {
    storage.set('collection', ViewData.collection.getSerializeCollection());
  }, [layoutViewData]);

  const handlePreviewClick = useCallback(() => {
    if (!layoutViewData) return;
  }, [layoutViewData]);

  useEffect(() => {}, []);
  return (
    <Box h="100%">
      <Grid templateColumns="repeat(5, 1fr)" h="100%">
        <Box
          textAlign="left"
          padding="0 10px"
          className="flex-box"
          fontSize="18px"
        >
          <Box h="18px" color={MAIN_COLOR} fontWeight="bold">
            Gamma
          </Box>
          <Box h="18px" mr="10px" fontSize="12px" transform="scale(.8)">
            Pre Alpha
          </Box>
          <Box
            h="18px"
            color={MAIN_COLOR}
            mr="10px"
            fontWeight="light"
            fontSize="12px"
          >
            {/* Low Code Editor */}
          </Box>
        </Box>
        <Box />
        <Flex justify="center" align="center">
          <Select
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
          </Select>
        </Flex>
        <Box />
        <Flex justify="flex-end" align="center" pr="10px">
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
import { useEffect, useRef, FC } from 'react';
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
import {
  useSettingDispatch,
  useSettingState,
  ActionType,
} from '@/store/setting';
import { Setting } from './setting';
import { deviceList, ViewportDevice } from '@/utils';
import './style.scss';

const deviceMap: { [key: string]: ViewportDevice } = {};
deviceList.forEach((device) => (deviceMap[device.id] = device));

export const TopBar: FC = () => {
  const state = useSettingState();
  const dispatch = useSettingDispatch();
  const { isOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLDivElement>(null);
  useEffect(() => {}, []);
  return (
    <div className="top-bar">
      <Grid templateColumns="repeat(5, 1fr)">
        <Box w="100%" textAlign="left" padding="0 10px" paddingTop="2px"></Box>
        <Box w="100%" />
        <Box w="100%" pt="4px">
          <Flex justify="center" align="center">
            <Select
              size="xs"
              focusBorderColor="bannerman.500"
              value={state.viewportDevice?.id}
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
        </Box>
        <Box w="100%" />
        <Box w="100%">
          <Flex justify="flex-end" align="center" pr="10px" pt="6px">
            <Button size="xs" ml="8px">
              保存
            </Button>
            <Button size="xs" ml="8px">
              预览
            </Button>
          </Flex>
        </Box>
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
    </div>
  );
};

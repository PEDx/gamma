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
import { MAIN_COLOR } from '@/editor/color';
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
      <Grid templateColumns="repeat(5, 1fr)" h="100%">
        <Box
          textAlign="left"
          padding="0 10px"
          className="flex-box"
          fontSize="18px"
        >
          <Box w="4px" h="18px" bgColor={MAIN_COLOR} mr="6px"></Box>
          <Box w="10px" h="18px" bgColor={MAIN_COLOR} mr="6px"></Box>
          <Box w="26px" h="18px" bgColor={MAIN_COLOR} mr="6px"></Box>
          <Box h="18px" color={MAIN_COLOR} mr="10px" fontWeight="bold">
            Gamma
          </Box>
          <Box h="18px" color={MAIN_COLOR} mr="10px" fontSize="14px">
            GAMMA
          </Box>
          <Box
            h="18px"
            color={MAIN_COLOR}
            mr="10px"
            fontWeight="light"
            fontSize="12px"
          >
            gamma
          </Box>
        </Box>
        <Box />
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
        <Box />
        <Flex justify="flex-end" align="center" pr="10px">
          <Button size="xs" ml="8px">
            保存
          </Button>
          <Button size="xs" ml="8px">
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
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
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
import Setting from './setting';
import { device } from '@/utils';
import './style.scss';

export default function TopBar() {
  const { isOpen, onClose } = useDisclosure();
  const btnRef = useRef();
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
              //   value={state.viewport_device}
              onChange={(e) => {
                // dispatch({ type: 'set_viewport_device', data: e.target.value });
              }}
            >
              {Object.keys(device).map((key) => (
                <option
                  value={key}
                  key={key}
                >{`${device[key].desc} - ${device[key].resolution.width}x${device[key].resolution.height}`}</option>
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
        color="editor"
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
}

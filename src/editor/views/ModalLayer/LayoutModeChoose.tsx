import { LayoutMode } from '@/runtime/LayoutMode';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  HStack,
  Box,
  useColorMode,
} from '@chakra-ui/react';
import {
  minorColor,
  MAIN_COLOR,
  groundColor,
  primaryColor,
} from '@/editor/color';
import { FC, useCallback, useEffect, useState } from 'react';
import { Icon } from '@/icons';
import { globalBus } from '@/editor/core/Event';

export interface ILayoutModeChooseProps {
  visible: boolean;
}

const LayoutModes = [
  {
    name: '长页面',
    description: '普通的滚动网页',
    value: LayoutMode.LongPage,
    icon: <Icon name="file-list" />,
  },
  {
    name: '翻页',
    description: '由多个全屏布局组件组成',
    value: LayoutMode.MultPage,
    icon: <Icon name="file-copy" />,
  },
  {
    name: '挂件',
    description: '常用于直播间展示活动或比赛',
    value: LayoutMode.Pendant,
    icon: <Icon name="rocket" />,
  },
];

export const LayoutModeChoose: FC<ILayoutModeChooseProps> = ({ visible }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selecteModeType, setSelecteModeType] = useState(LayoutMode.LongPage);

  useEffect(() => {
    visible ? onOpen() : onClose();
  }, [visible]);

  const handleBeginEdit = useCallback(() => {
    onClose();
    globalBus.emit('layout-mode', selecteModeType);
  }, [selecteModeType]);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      isCentered={true}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent bg={primaryColor[colorMode]}>
        <ModalHeader>欢迎来到 Gamma 🎉</ModalHeader>
        <ModalBody pb={'16px'}>
          <Box
            w="100%"
            h="300px"
            bgColor={minorColor[colorMode]}
            mb="24px"
            className="flex-box-c"
            fontSize="32px"
          >
            <Icon name="big-draw" fontSize="500px"></Icon>
          </Box>
          <Box fontSize="14px" fontWeight="bold" mb="16px">
            请选择页面类型：
          </Box>
          <HStack spacing="16px">
            {LayoutModes.map(({ name, value, icon, description }) => {
              const selected = selecteModeType === value;
              return (
                <Box
                  key={value}
                  boxShadow="sm"
                  p="16px 0"
                  flex="1"
                  rounded="6px"
                  cursor="pointer"
                  bgColor={minorColor[colorMode]}
                  _hover={{
                    background: groundColor[colorMode],
                  }}
                  _active={{
                    opacity: '0.7',
                  }}
                  _focus={{
                    outline: 0,
                  }}
                  onClick={() => setSelecteModeType(value)}
                  border={
                    selected
                      ? `1px solid ${MAIN_COLOR}`
                      : '1px solid transparent'
                  }
                  position="relative"
                >
                  <Box className="flex-box-c" fontSize="28px" mb="16px">
                    {icon}
                  </Box>
                  <Box fontSize="14px" textAlign="center" mb="8px">
                    {name}
                  </Box>
                  <Box fontSize="12px" textAlign="center" opacity=".7">
                    {description}
                  </Box>
                  <Icon
                    name="checkbox-circle-fill"
                    color={MAIN_COLOR}
                    fontSize="20px"
                    position="absolute"
                    right="6px"
                    bottom="6px"
                    display={selected ? 'block' : 'none'}
                  ></Icon>
                </Box>
              );
            })}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={handleBeginEdit}>
            开始编辑
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

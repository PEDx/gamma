/* eslint-disable react/jsx-no-undef */
import React, { useEffect, FC } from 'react';
import {
  IconButton,
  Tooltip,
  Grid,
  Box,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Input,
  useColorMode,
} from '@chakra-ui/react';
import useStorageState from '@/hooks/useStorageState';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import './style.scss';

export const BottomBar: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [viewportScale, setViewportScale] = useStorageState(
    'viewportScale',
    50,
  );
  useEffect(() => {}, []);
  return (
    <div className="bottom-bar">
      <Grid templateColumns="repeat(5, 1fr)" h="20px">
        <Box w="100%" />
        <Box w="100%" />
        <Box w="100%" h="20px">
          <Flex>
            <Slider
              mt="-2px"
              value={viewportScale}
              size="sm"
              color="gray"
              w="200px"
              onChange={(val) => setViewportScale(val)}
            >
              <SliderTrack />
              <SliderFilledTrack />
              <SliderThumb />
            </Slider>
            <Input
              value={viewportScale}
              focusBorderColor="bannerman.400"
              size="xs"
              w="50px"
              ml="8px"
              mt="1px"
              onChange={(event) => {
                setViewportScale(+event.target.value);
              }}
            />
          </Flex>
        </Box>
        <Box w="100%" />
        <Box
          w="100%"
          h="20px"
          lineHeight="17px"
          textAlign="right"
          padding="0 10px"
        >
          <Tooltip
            hasArrow
            label={colorMode === 'light' ? '深色模式' : '浅色模式'}
            bg="gray.600"
            fontSize="12px"
          >
            <IconButton
              variant="ghost"
              aria-label="深色模式"
              icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              size="xs"
              onClick={toggleColorMode}
            />
          </Tooltip>
        </Box>
      </Grid>
    </div>
  );
};

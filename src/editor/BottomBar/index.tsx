/* eslint-disable react/jsx-no-undef */
import { useEffect, FC } from 'react';
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
      <Grid templateColumns="repeat(5, 1fr)" h="100%">
        <Box w="100%" />
        <Box w="100%" />
        <Box w="100%">
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
        <Box w="100%" lineHeight="22px" textAlign="right" padding="0 10px">
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
        </Box>
      </Grid>
    </div>
  );
};

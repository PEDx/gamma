import { Box } from '@chakra-ui/react';
import { FC, useEffect, useRef } from 'react';
import { ShadowView } from '@/editor/views/ShadowView';
import { MAIN_COLOR } from '@/editor/color';

interface IMiniMapParams {
  host: HTMLElement | null;
}

const ratio = 0.4;
export const MiniMap: FC<IMiniMapParams> = ({ host }) => {
  const staticPreviewRef = useRef<HTMLDivElement | null>(null);
  const dynamicPreviewRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {}, []);
  return (
    <Box
      position="absolute"
      right="20px"
      top="40px"
      transform={`scale(${ratio})`}
      transformOrigin="100% 0"
    >
      <Box
        backgroundColor={MAIN_COLOR}
        h="32px"
        fontSize="28px"
        fontWeight="600"
        className="flex-box"
        p="0 20px"
      >
        static view
      </Box>
      <Box
        position="relative"
        w={host!.clientWidth}
        h={host!.clientHeight}
        backgroundColor="#fff"
      >
        <ShadowView>
          <div
            ref={staticPreviewRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          ></div>
        </ShadowView>
      </Box>
      <Box
        backgroundColor={MAIN_COLOR}
        h="32px"
        fontSize="28px"
        fontWeight="600"
        className="flex-box"
        p="0 20px"
        mt="40px"
      >
        dynamic view
      </Box>
      <Box
        position="relative"
        w={host!.clientWidth}
        h={host!.clientHeight}
        backgroundColor="#fff"
      >
        <ShadowView>
          <div
            ref={dynamicPreviewRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          ></div>
        </ShadowView>
      </Box>
    </Box>
  );
};

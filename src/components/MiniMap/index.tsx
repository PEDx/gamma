import { Box } from '@chakra-ui/react';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { globalBus } from '@/class/Event';
import { FC, useEffect, useRef } from 'react';
import { ShadowView } from '@/components/ShadowView';
import { MAIN_COLOR } from '@/editor/color';
import { Render } from '@/class/Render';

interface IMiniMapParams {
  host: HTMLElement | null;
}

const ratio = 0.4;
export const MiniMap: FC<IMiniMapParams> = ({ host }) => {
  const staticPreviewRef = useRef<HTMLDivElement | null>(null);
  const dynamicPreviewRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    globalBus.on<RootViewData>('preview', (data) => {
      if (!staticPreviewRef.current) return;
      if (!dynamicPreviewRef.current) return;

      staticPreviewRef.current.innerHTML = data.element.innerHTML;

      const renderRootViewData = new RootViewData({
        element: dynamicPreviewRef.current,
        configurators: null,
      });

      const render = new Render({
        rootViewData: renderRootViewData,
      });

      render.render(RootViewData.collection.getSerializeCollection());
    });
  }, []);
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

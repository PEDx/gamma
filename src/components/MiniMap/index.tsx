import { Box } from '@chakra-ui/react';
import { useEditorState } from '@/store/editor';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { globalBus } from '@/class/Event';
import { FC, useEffect, useRef } from 'react';
import { ShadowView } from '@/components/ShadowView';

interface IMiniMapParams {
  host: HTMLElement | null;
}

const ratio = 0.4;
export const MiniMap: FC<IMiniMapParams> = ({ host }) => {
  const previewRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    globalBus.on<RootViewData>('save', (data) => {
      if (!previewRef.current) return;
      // static
      previewRef.current.innerHTML = data.element.innerHTML;
      // runtime

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
        position="relative"
        w={host!.clientWidth}
        h={host!.clientHeight}
        backgroundColor="#fff"
      >
        <ShadowView>
          <div
            ref={previewRef}
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

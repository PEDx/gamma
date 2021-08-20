import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { DragItem, DragType } from '@/core/DragAndDrop/drag';
import { IElementMeta } from '@gamma/runtime';
import { minorColor } from '@/color';
import { safeEventBus, SafeEventType } from '@/events';

export interface WidgetDragMeta {
  type: DragType.widget;
  data: string;
}

const gammaElementList = [
  'base-box',
  'widget-button',
  'widget-image',
  'widget-rich-text',
  'widget-text',
];

const loadGammaElement = (url: string) => System.import(url);

const getGammaElementUrl = (elementId: string) => {
  return `http://192.168.38.15:7070/${elementId}/dist/index.js`;
};

export const WidgetSource: FC = () => {
  const { colorMode } = useColorMode();
  const [elementList, setElementList] = useState<any[]>([]);

  useEffect(() => {
    const promistList: Promise<System.Module>[] = [];
    gammaElementList.forEach((elementId) => {
      promistList.push(loadGammaElement(getGammaElementUrl(elementId)));
    });
    Promise.all(promistList).then((resArr) => {
      console.log(resArr);
      safeEventBus.emit(
        SafeEventType.GAMMA_ELEMENT_LOADED,
        new Map((resArr as any[]).map((res) => [res.meta.id, res])),
      );
      setElementList(resArr);
    });
  }, []);

  const initDragEvent = useCallback(
    (node: HTMLDivElement | null, meta: IElementMeta) => {
      if (!node) return;
      new DragItem<WidgetDragMeta>({
        node,
        type: DragType.widget,
        data: meta.id,
      });
    },
    [],
  );
  return useMemo(
    () => (
      <Box p="8px">
        {elementList.map((element) => (
          <Box
            key={element.meta.id}
            w="100%"
            h="32px"
            backgroundColor="#343438"
            mb="8px"
            borderRadius="4px"
            cursor="grab"
            className="flex-box-c"
            bgColor={minorColor[colorMode]}
            ref={(node) => initDragEvent(node, element.meta)}
          >
            {element.meta.name}
          </Box>
        ))}
      </Box>
    ),
    [elementList],
  );
};

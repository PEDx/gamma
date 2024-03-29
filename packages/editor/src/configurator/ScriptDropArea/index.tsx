import {
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useCallback,
} from 'react';
import {
  Box,
  useColorMode,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Button,
  PopoverFooter,
} from '@chakra-ui/react';
import { DropItem } from '@/core/DragAndDrop/drop';
import { DragType } from '@/core/DragAndDrop/drag';
import {
  ConfiguratorComponent,
  RuntimeElement,
  ScriptData,
} from '@gamma/runtime';
import { MAIN_COLOR, borderColor } from '@/color';
import { IGammaElementDragMeta } from '@/views/WidgetSource';
import { renderer } from '@/layout/Viewport';
import { safeEventBus, SafeEventType } from '@/events';
import { Icon } from '@/icons';

export const ScriptDropArea = forwardRef<
  ConfiguratorComponent<IGammaElementDragMeta['data']>['methods'],
  ConfiguratorComponent<IGammaElementDragMeta['data']>['props']
>(({ onChange }, ref) => {
  const { colorMode } = useColorMode();
  const scriptData = useRef<ScriptData | null>(null);
  const [scriptId, setScriptId] = useState('');
  const dropArea = useRef<HTMLDivElement | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const createScriptData = useCallback(
    (elementId: string) => {
      if (scriptData.current) scriptData.current.suspend = true;
      const scriptElement = renderer.createRuntimeElement(
        elementId,
      ) as ScriptData;
      if (!scriptElement) return;
      onChange(scriptElement.id);
      setScriptId(scriptElement.id);
      scriptData.current = scriptElement;
    },
    [scriptId],
  );

  useEffect(() => {
    const dropItem = new DropItem<IGammaElementDragMeta>({
      node: dropArea.current as HTMLElement,
      type: DragType.script,
      onDragenter: (event) => {
        setDragOver(false);
        if (dropArea.current?.contains(event.target as Node)) setDragOver(true);
      },
      onDrop: (evt) => {
        const meta = dropItem.getDragMeta(evt);
        if (!meta?.data) return;
        const elementId = meta.data;
        createScriptData(elementId);
        setTimeout(() => {
          safeEventBus.emit(SafeEventType.REFRESH_CONFIGURATOR_PANEL);
        });
      },
      onDragend: () => {
        setDragOver(false);
      },
    });
    return () => {
      dropItem.destory();
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      setValue: (id) => {
        const scriptElement = RuntimeElement.collection.getItemByID(
          id,
        ) as ScriptData;
        setScriptId(id);
        scriptData.current = scriptElement;
      },
    }),
    [],
  );

  return (
    <Box
      borderRadius="var(--chakra-radii-sm)"
      border={scriptId ? 'solid' : 'dashed'}
      borderColor={dragOver ? MAIN_COLOR : borderColor[colorMode]}
      borderWidth="1px"
      position="relative"
      p="0 8px"
    >
      <Box
        ref={dropArea}
        zIndex="2"
        lineHeight="28px"
        h="28px"
        w="100%"
        textAlign="center"
        position="relative"
        className="flex-box"
      >
        {scriptId ? (
          <>
            <Box flex="1" isTruncated>
              {scriptId}
            </Box>
            <Box h="100%" className="flex-box">
              <Popover isLazy>
                <PopoverTrigger>
                  <IconButton
                    aria-label="delete"
                    icon={<Icon name="delete" />}
                    mr="4px"
                  />
                </PopoverTrigger>
                <PopoverContent w="200px">
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody>确认删除脚本？</PopoverBody>
                  <PopoverFooter
                    border="0"
                    d="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    pb={4}
                  >
                    <Box textAlign="right" w="100%">
                      <Button colorScheme="green" mr="8px">
                        取消
                      </Button>
                      <Button colorScheme="gray">确认</Button>
                    </Box>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>

              <IconButton
                aria-label="refresh"
                icon={<Icon name="refresh" />}
                mr="4px"
              />
            </Box>
          </>
        ) : (
          '拖拽脚本组件到此处'
        )}
      </Box>
    </Box>
  );
});

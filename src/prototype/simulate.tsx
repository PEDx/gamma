import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@/chakra';
import { Center, Flex, Select, useColorMode } from '@chakra-ui/react';
import { groundColor, primaryColor, subColor } from '@/editor/color';
import { deviceList, storage, ViewportDevice } from '@/utils';
import { Render } from '@/class/Render';
import { useCallback, useEffect, useRef } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import { IViewDataSnapshotMap } from '@/class/ViewData/ViewDataCollection';
import { RootViewData } from '@/class/ViewData/RootViewData';
import { ViewDataSnapshot } from '@/class/ViewData/ViewDataSnapshot';
import '../index.scss';

const deviceMap: { [key: string]: ViewportDevice } = {};
deviceList.forEach((device) => (deviceMap[device.id] = device));

const createRootDiv = () => {
  const element = document.createElement('DIV');
  element.style.setProperty('position', 'relative');
  element.style.setProperty('overflow', 'hidden');
  return element;
};

export const Simulate = () => {
  const rootViewRef = useRef<HTMLDivElement | null>(null);
  const { colorMode } = useColorMode();
  const [device, setDevice] = useStorageState<ViewportDevice>(
    'wevice',
    deviceList[0],
  );

  useEffect(() => {
    if (!rootViewRef.current) return;

    const renderData = storage.get<IViewDataSnapshotMap>('collection') || {};
    const rootRenderData = Object.values(renderData)
      .filter((data) => {
        if (data.isRoot) return data;
      })
      .sort((a, b) => a.index! - b.index!);

    rootRenderData.forEach((data) => {
      const rootViewData = addRootView(data);
      const target = new Render({
        target: rootViewData,
      });
      if (!renderData) return;
      target.render(data, renderData);
    });
  }, []);

  const addRootView = useCallback((data: ViewDataSnapshot) => {
    const rootViewData = new RootViewData({
      element: createRootDiv(),
    });
    rootViewData.restore(data);
    rootViewRef.current?.appendChild(rootViewData.element);
    return rootViewData;
  }, []);

  return (
    <Flex h="100%" flexDirection="column">
      <Center
        height="32px"
        bg={primaryColor[colorMode]}
        borderBottomColor={groundColor[colorMode]}
      >
        <Select
          w="300px"
          size="xs"
          defaultValue={device.id}
          onChange={(e) => {
            const _id = e.target.value;
            setDevice(deviceMap[_id]);
          }}
        >
          {deviceList.map((device) => (
            <option
              value={device.id}
              key={device.id}
            >{`${device.label} - ${device.resolution.width}x${device.resolution.height}`}</option>
          ))}
        </Select>
      </Center>
      <Center flex="1" bg={subColor[colorMode]}>
        <div
          ref={rootViewRef}
          className="simulate"
          style={{
            width: `${device?.resolution.width}px`,
            height: `${device?.resolution.height}px`,
            backgroundColor: '#fff',
            overflow: 'auto',
          }}
        ></div>
      </Center>
    </Flex>
  );
};

ReactDOM.render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <Simulate />
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root'),
);

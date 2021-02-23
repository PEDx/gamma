import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { DataView, Setter } from '@/class/DataView';
import { StyleSetter } from '@/class/StyleSetter';
import { DraggerSetter } from '@/class/DraggerSetter';
import {
  ConfiguratorStyleSetter,
  ConfiguratorType,
} from '@/class/ConfiguratorSetter';

export type BoxViewProps = {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: React.ReactNode;
};

export interface BoxViewMethods {
  dataView: DataView | null;
}

export const BoxView = forwardRef<BoxViewMethods, BoxViewProps>(
  ({ onMouseDown, children }, ref) => {
    const eleRef = useRef<HTMLDivElement | null>(null);
    const [dataView, setDataView] = useState<DataView | null>(null);
    useEffect(() => {
      setDataView(
        // 编辑数据声明
        new DataView(
          eleRef.current as HTMLDivElement,
          [
            new DraggerSetter('width', eleRef.current!.offsetWidth, true),
            new DraggerSetter('height', eleRef.current!.offsetHeight, true),
            new DraggerSetter('top', eleRef.current!.offsetTop, true),
            new DraggerSetter('left', eleRef.current!.offsetLeft, true),
            new ConfiguratorStyleSetter({
              lable: '层级',
              type: ConfiguratorType.NUMBER,
              name: 'zIndex',
              value: 1,
            }),
          ],
          (s: Setter) => {
            // console.log(s);
          },
        ),
      );
    }, [eleRef]);
    useImperativeHandle(
      ref,
      () => ({
        dataView,
      }),
      [dataView],
    );
    return (
      <div
        ref={eleRef}
        className="editable-view"
        onMouseDown={onMouseDown}
        style={{
          position: 'absolute',
          cursor: 'pointer',
        }}
      >
        {children}
      </div>
    );
  },
);

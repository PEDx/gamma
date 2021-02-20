/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import './style.scss';
import useEventListener from '@/hooks/useEventListener';
import {
  DIRECTIONS,
  CHECK_EDGE,
  LINE_TYPE,
  ADSORB_DISTANCE,
  binarySearchSidesValue,
  preventDefaultHandler,
} from '@/utils';
import { BoxDataView } from '@/packages/BoxView';
const distance = ADSORB_DISTANCE;
const min_size = 10;

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function fondCloselyAdsorbLine(
  { x, y, width, height }: Rect,
  {
    x: adsorb_x_arr,
    y: adsorb_y_arr,
  }: {
    x: number[];
    y: number[];
  },
  check_edge: number,
) {
  if (adsorb_x_arr.length <= 0 || adsorb_y_arr.length <= 0) return [];
  const box_h_edge = [];
  const box_v_edge = [];
  if (check_edge & CHECK_EDGE.HM) {
    const middle_x = x + width / 2;
    box_h_edge.push(middle_x);
  }
  if (check_edge & CHECK_EDGE.L) {
    const left_edge = x;
    box_h_edge.push(left_edge);
  }
  if (check_edge & CHECK_EDGE.R) {
    const right_edge = x + width;
    box_h_edge.push(right_edge);
  }
  if (check_edge & CHECK_EDGE.VM) {
    const middle_y = y + height / 2;
    box_v_edge.push(middle_y);
  }
  if (check_edge & CHECK_EDGE.T) {
    const top_edge = y;
    box_v_edge.push(top_edge);
  }
  if (check_edge & CHECK_EDGE.B) {
    const bottom_edge = y + height;
    box_v_edge.push(bottom_edge);
  }

  let close_adsorb_x = adsorb_x_arr[0];
  let close_adsorb_y = adsorb_y_arr[0];
  let min_x_dis = 100000;
  let min_y_dis = 100000;
  // 只需要判断矩形边两侧的线即可
  // log(adsorb_x_arr.length) ~ 3log(adsorb_x_arr.length)
  box_h_edge.forEach((edge_x) => {
    binarySearchSidesValue(adsorb_x_arr, edge_x).forEach((val) => {
      const dis = Math.abs(val - edge_x);
      if (dis < min_x_dis) {
        min_x_dis = dis;
        close_adsorb_x = val;
      }
    });
  });
  box_v_edge.forEach((edge_y) => {
    binarySearchSidesValue(adsorb_y_arr, edge_y).forEach((val) => {
      const dis = Math.abs(val - edge_y);
      if (dis < min_y_dis) {
        min_y_dis = dis;
        close_adsorb_y = val;
      }
    });
  });
  return [close_adsorb_x, close_adsorb_y];
}

type AdsorbLine = {
  type: number;
  position: number;
};

interface EditableBoxProps {
  adsorbLineArr: AdsorbLine[];
  onChange: () => void;
  onMouseDown: (e: Event) => void;
}
interface EditableBoxMethods {
  elementMousedown: (e: Event) => void;
  setEditElement: (b: BoxDataView) => void;
  clearEditElement: () => void;
  getEditableElement: () => void;
}

export const EditableBox = forwardRef<EditableBoxMethods, EditableBoxProps>(
  ({ adsorbLineArr, onChange, onMouseDown }: EditableBoxProps, ref) => {
    let x0: number, y0: number, x1: number, y1: number;
    let L0: number, R0: number, T0: number, B0: number, EH: number, EW: number;
    let offsetRight,
      offsetBottom = 0;
    const adsorbLineX = useRef<number>(0);
    const adsorbLineY = useRef<number>(0);
    const isEditing = useRef(false);
    const isMoving = useRef(false);
    const active = useRef(false);
    const editableDataView = useRef<BoxDataView | null>(null);
    const editableElement = useRef<HTMLDivElement | null>(null);
    const editableBox = useRef<HTMLDivElement | null>(null);
    const adsorb_x_arr = useRef<number[]>([]);
    const adsorb_y_arr = useRef<number[]>([]);
    const editDirections = useRef<number>(DIRECTIONS.NULL);

    useEffect(() => {
      adsorb_x_arr.current = adsorbLineArr
        .filter((line) => line.type === LINE_TYPE.VERTICAL)
        .map((val) => val.position);
      adsorb_y_arr.current = adsorbLineArr
        .filter((line) => line.type === LINE_TYPE.HORIZONTAL)
        .map((val) => val.position);
    }, [adsorbLineArr]);

    const move_mousedownHandler = useCallback((e) => {
      const ele = editableElement.current;
      if (!ele) return;
      const container = ele.offsetParent;
      active.current = true;
      isMoving.current = true;
      L0 = 0;
      R0 = container!.clientWidth;
      T0 = 0;
      B0 = container!.clientHeight;

      //获取元素距离定位父级的x轴及y轴距离
      x0 = ele.offsetLeft;
      y0 = ele.offsetTop;
      //获取此时鼠标距离视口左上角的x轴及y轴距离
      x1 = e.clientX;
      y1 = e.clientY;
      //获取此时元素的宽高
      EW = ele.offsetWidth;
      EH = ele.offsetHeight;
      onMouseDown(e);
    }, []);

    const edit_mousedownHandler = useCallback((e) => {
      if (!e.target.dataset.direction) {
        isEditing.current = false;
        return;
      }
      onMouseDown(e);
      editDirections.current = e.target.dataset.direction;
      isEditing.current = true;
    }, []);

    const move_mousemoveHandler = useCallback((e) => {
      if (!active.current) return;

      if (!isMoving.current || isEditing.current) return;

      const dv = editableDataView.current;
      //获取此时鼠标距离视口左上角的x轴及y轴距离
      const x2 = e.clientX;
      const y2 = e.clientY;
      //计算此时元素应该距离视口左上角的x轴及y轴距离
      let X = x0 + (x2 - x1);
      let Y = y0 + (y2 - y1);
      //获取鼠标移动时元素四边的瞬时值
      const L = X;
      const R = X + EW;
      const T = Y;
      const B = Y + EH;
      //在将X和Y赋值给left和top之前，进行范围限定。只有在范围内时，才进行相应的移动
      // 如果到达左侧的吸附范围，则left置L0
      if (L - L0 < distance) {
        X = L0;
      }
      //如果到达右侧的吸附范围，则left置为R0
      if (R0 - R < distance) {
        X = R0 - EW;
      }

      //如果到达上侧的吸附范围，则top置T0
      if (T - T0 < distance) {
        Y = T0;
      }
      //如果到达右侧的吸附范围，则top置为B0
      if (B0 - B < distance) {
        Y = B0 - EH;
      }
      const [adsorb_x, adsorb_y] = fondCloselyAdsorbLine(
        {
          x: X,
          y: Y,
          width: EW,
          height: EH,
        },
        { x: adsorb_x_arr.current, y: adsorb_y_arr.current },
        CHECK_EDGE.ALL,
      );
      // 辅助线 吸附
      if (X > adsorb_x - distance && X < adsorb_x + distance) {
        X = adsorb_x;
        adsorbLineX.current = X;
      }
      if (X > adsorb_x - EW - distance && X < adsorb_x - EW + distance) {
        X = adsorb_x - EW;
        adsorbLineX.current = X;
      }
      if (
        X > adsorb_x - EW / 2 - distance &&
        X < adsorb_x - EW / 2 + distance
      ) {
        X = adsorb_x - EW / 2;
        adsorbLineX.current = X;
      }
      if (Y > adsorb_y - distance && Y < adsorb_y + distance) {
        Y = adsorb_y;
        adsorbLineY.current = Y;
      }
      if (Y > adsorb_y - EH - distance && Y < adsorb_y - EH + distance) {
        Y = adsorb_y - EH;
        adsorbLineY.current = Y;
      }
      if (
        Y > adsorb_y - EH / 2 - distance &&
        Y < adsorb_y - EH / 2 + distance
      ) {
        Y = adsorb_y - EH / 2;
        adsorbLineY.current = Y;
      }
      //将X和Y的值赋给left和top，使元素移动到相应位置
      dv!.setStyleValue('left', X);
      dv!.setStyleValue('top', Y);
      updateEditableBoxAttr('top', dv!.getItemValueByKey('top'));
      updateEditableBoxAttr('left', dv!.getItemValueByKey('left'));
    }, []);

    const edit_mousemoveHandler = useCallback((e) => {
      if (!active.current) return;
      if (!isEditing.current) return;
      const ele = editableElement.current;
      const dv = editableDataView.current;
      const container = editableBox.current!.offsetParent;
      if (!ele) return;
      offsetRight = ele.clientWidth + ele.offsetLeft;
      offsetBottom = ele.clientHeight + ele.offsetTop;
      //获取此时鼠标距离视口左上角的x轴及y轴距离
      const x2 = e.clientX;
      const y2 = e.clientY;
      let eleW = 0;
      let eleL = 0;
      let eleT = 0;
      let eleH = 0;
      //如果改变元素尺寸功能开启

      // ele.clientWidth 是过去时
      // eleW 是现在进行时

      //处于左侧范围
      if (editDirections.current & DIRECTIONS.L) {
        eleW = EW + (x1 - x2);
        eleL = x0 + (x2 - x1);
      }
      //处于右侧范围
      if (editDirections.current & DIRECTIONS.R) {
        eleW = EW + (x2 - x1);
      }
      //处于上侧范围
      if (editDirections.current & DIRECTIONS.T) {
        eleT = y0 + (y2 - y1);
        eleH = EH + (y1 - y2);
      }
      //处于下侧范围
      if (editDirections.current & DIRECTIONS.B) {
        eleH = EH + (y2 - y1);
      }

      // 尺寸限定
      if (eleW < min_size) {
        eleW = min_size;
        eleL = offsetRight - eleW;
      }
      if (editDirections.current & DIRECTIONS.R) {
        eleL = ele.offsetLeft;
      }
      if (eleH < min_size) {
        eleH = min_size;
        eleT = offsetBottom - eleH;
      }
      if (editDirections.current & DIRECTIONS.B) {
        eleT = ele.offsetTop;
      }
      //范围限定
      // 限制右边界 吸附
      if (
        eleW + eleL > container!.clientWidth - distance &&
        !(editDirections.current & DIRECTIONS.L)
      ) {
        eleW = container!.clientWidth - ele.offsetLeft;
      }
      // 限制下边界 吸附
      if (
        eleH + eleT > container!.clientHeight - distance &&
        !(editDirections.current & DIRECTIONS.T)
      ) {
        eleH = container!.clientHeight - ele.offsetTop;
      }
      // 限制左边界 吸附
      if (eleL < 0 + distance && !(editDirections.current & DIRECTIONS.R)) {
        eleL = 0;
        eleW = ele.clientWidth + ele.offsetLeft;
      }
      // 限制上边界 吸附
      if (eleT < 0 + distance && !(editDirections.current & DIRECTIONS.B)) {
        eleT = 0;
        eleH = ele.clientHeight + ele.offsetTop;
      }

      // 辅助线 吸附
      const [adsorb_x, adsorb_y] = fondCloselyAdsorbLine(
        {
          x: eleL,
          y: eleT,
          width: eleW,
          height: eleH,
        },
        { x: adsorb_x_arr.current, y: adsorb_y_arr.current },
        editDirections.current,
      );

      if (
        eleL > adsorb_x - distance &&
        eleL < adsorb_x + distance &&
        !(editDirections.current & DIRECTIONS.R)
      ) {
        eleL = adsorb_x;
        eleW = offsetRight - adsorb_x;
      }
      if (
        eleL + eleW > adsorb_x - distance &&
        eleL + eleW < adsorb_x + distance &&
        !(editDirections.current & DIRECTIONS.L)
      ) {
        eleW = adsorb_x - ele.offsetLeft;
      }

      if (
        eleT > adsorb_y - distance &&
        eleT < adsorb_y + distance &&
        !(editDirections.current & DIRECTIONS.B)
      ) {
        eleT = adsorb_y;
        eleH = offsetBottom - adsorb_y;
      }

      if (
        eleT + eleH > adsorb_y - distance &&
        eleT + eleH < adsorb_y + distance &&
        !(editDirections.current & DIRECTIONS.T)
      ) {
        eleH = adsorb_y - ele.offsetTop;
      }

      if (eleW !== undefined) {
        //赋值
        dv!.setStyleValue('width', eleW);
        updateEditableBoxAttr('width', dv!.getItemValueByKey('width'));
      }
      if (eleH !== undefined) {
        dv!.setStyleValue('height', eleH);
        updateEditableBoxAttr('height', dv!.getItemValueByKey('height'));
      }
      if (eleT !== undefined) {
        dv!.setStyleValue('top', eleT);
        updateEditableBoxAttr('top', dv!.getItemValueByKey('top'));
      }
      if (eleL !== undefined) {
        dv!.setStyleValue('left', eleL);
        updateEditableBoxAttr('left', dv!.getItemValueByKey('left'));
      }
    }, []);

    const mouseupHandler = useCallback(() => {
      if (!active.current) return;
      const dv = editableDataView.current;
      adsorbLineX.current = 0;
      adsorbLineY.current = 0;
      onChange();
      editDirections.current = DIRECTIONS.NULL;
      dv!.setStyleValue('cursor', 'move');
      //鼠标抬起时，表示停止运动
      isEditing.current = false;
      active.current = false;
      isMoving.current = false;
    }, []);

    useEventListener('mousemove', move_mousemoveHandler);
    useEventListener('mousemove', edit_mousemoveHandler);
    useEventListener('mouseup', mouseupHandler);
    useEffect(() => {
      editableBox.current!.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      editableBox.current!.addEventListener('mousedown', move_mousedownHandler);
      editableBox.current!.addEventListener('mousedown', edit_mousedownHandler);
      editableBox.current!.addEventListener('mousedown', preventDefaultHandler);
    }, []);

    const updateEditableBoxAttr = useCallback((key: string, value: string) => {
      const SEB = editableBox.current;
      if (!SEB) return;
      SEB.style.setProperty(key, value);
    }, []);

    const clearEditElement = useCallback(() => {
      editableElement.current = null;
      active.current = false;
      updateEditableBoxAttr('display', 'none');
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        elementMousedown: (e: Event) => {
          move_mousedownHandler(e);
        },
        setEditElement: (selectEditableView: BoxDataView) => {
          const el = selectEditableView.el;
          editableDataView.current = selectEditableView;
          if (editableElement.current === el) return;
          editableElement.current = el as HTMLDivElement;
          updateEditableBoxAttr('cursor', 'move');
          updateEditableBoxAttr(
            'width',
            selectEditableView.getItemValueByKey('width'),
          );
          updateEditableBoxAttr(
            'height',
            selectEditableView.getItemValueByKey('height'),
          );
          updateEditableBoxAttr(
            'top',
            selectEditableView.getItemValueByKey('top'),
          );
          updateEditableBoxAttr(
            'left',
            selectEditableView.getItemValueByKey('left'),
          );
          updateEditableBoxAttr('display', 'block');
        },
        clearEditElement,
        getEditableElement: () => {
          return editableElement.current;
        },
      }),
      [],
    );
    return (
      <React.Fragment>
        <div className="editable-box" ref={editableBox}>
          <i
            className="arrow-handler corner top-left-arrow-handler"
            data-direction={DIRECTIONS.L | DIRECTIONS.T}
          />
          <i
            className="arrow-handler corner bottom-left-arrow-handler"
            data-direction={DIRECTIONS.L | DIRECTIONS.B}
          />
          <i
            className="arrow-handler corner top-right-arrow-handler"
            data-direction={DIRECTIONS.T | DIRECTIONS.R}
          />
          <i
            className="arrow-handler corner bottom-right-arrow-handler"
            data-direction={DIRECTIONS.B | DIRECTIONS.R}
          />
          <i
            className="arrow-handler top-arrow-handler"
            data-direction={DIRECTIONS.T}
          />
          <i
            className="arrow-handler left-arrow-handler"
            data-direction={DIRECTIONS.L}
          />
          <i
            className="arrow-handler bottom-arrow-handler"
            data-direction={DIRECTIONS.B}
          />
          <i
            className="arrow-handler right-arrow-handler"
            data-direction={DIRECTIONS.R}
          />
        </div>
      </React.Fragment>
    );
  },
);

export const movable = ({ element, distance }, callback) => {
  if (!element) return;
  let x0, y0, x1, y1;
  let L0, R0, T0, B0, EH, EW;
  let isMoving = false;
  let X, Y;
  const handleMouseDown = (e) => {
    isMoving = true;
    L0 = 0;
    R0 = element.offsetParent.clientWidth;
    T0 = 0;
    B0 = element.offsetParent.clientHeight;
    //获取元素距离定位父级的x轴及y轴距离
    x0 = element.offsetLeft;
    y0 = element.offsetTop;
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    x1 = e.clientX;
    y1 = e.clientY;
    //获取此时元素的宽高
    EW = element.offsetWidth;
    EH = element.offsetHeight;
  };
  const move_mousemoveHandler = (e) => {
    if (!isMoving) {
      return;
    }
    //获取此时鼠标距离视口左上角的x轴及y轴距离
    const x2 = e.clientX;
    const y2 = e.clientY;
    //计算此时元素应该距离视口左上角的x轴及y轴距离
    X = x0 + (x2 - x1);
    Y = y0 + (y2 - y1);
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
    //将X和Y的值赋给left和top，使元素移动到相应位置
    element.style.left = X + 'px';
    element.style.top = Y + 'px';
  };
  const move_mouseupHandler = (e) => {
    isMoving &&
      callback &&
      callback({
        x: X,
        y: Y,
      });
    //鼠标抬起时，表示停止运动
    isMoving = false;
    //释放全局捕获
    if (element.releaseCapture) {
      element.releaseCapture();
    }
  };
  element.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('mousemove', move_mousemoveHandler);
  document.addEventListener('mouseup', move_mouseupHandler);
};

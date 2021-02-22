export type deviceDesc = {
  desc: string;
  resolution: {
    width: number;
    height: number;
  };
};

export const device: { [key: string]: deviceDesc } = {
  widget: {
    desc: 'widget',
    resolution: {
      width: 90,
      height: 667,
    },
  },
  widget2x: {
    desc: 'widget@2x',
    resolution: {
      width: 180,
      height: 667,
    },
  },
  widget3x: {
    desc: 'widget@3x',
    resolution: {
      width: 270,
      height: 667,
    },
  },
  iphone5: {
    desc: 'iPhone 5/5s',
    resolution: {
      width: 320,
      height: 568,
    },
  },
  iphone6: {
    desc: 'iPhone 6/6s',
    resolution: {
      width: 375,
      height: 667,
    },
  },
  iphone6p: {
    desc: 'iPhone 6 Plus',
    resolution: {
      width: 414,
      height: 736,
    },
  },
  iphonex: {
    desc: 'iPhone X/Xs',
    resolution: {
      width: 375,
      height: 812,
    },
  },
  ipad: {
    desc: 'iPad',
    resolution: {
      width: 768,
      height: 1024,
    },
  },
};

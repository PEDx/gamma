export interface ViewportDevice {
  id: string;
  label: string;
  resolution: {
    width: number;
    height: number;
  };
}

export const deviceList: ViewportDevice[] = [
  {
    id: 'widget',
    label: 'widget',
    resolution: {
      width: 90,
      height: 667,
    },
  },
  {
    id: 'widget2x',
    label: 'widget@2x',
    resolution: {
      width: 180,
      height: 667,
    },
  },
  {
    id: 'widget3x',
    label: 'widget@3x',
    resolution: {
      width: 270,
      height: 667,
    },
  },
  {
    id: 'iphone5',
    label: 'iPhone 5/5s',
    resolution: {
      width: 320,
      height: 568,
    },
  },
  {
    id: 'iphone6',
    label: 'iPhone 6/6s',
    resolution: {
      width: 375,
      height: 667,
    },
  },
  {
    id: 'iphone6p',
    label: 'iPhone 6 Plus',
    resolution: {
      width: 414,
      height: 736,
    },
  },
  {
    id: 'iphonex',
    label: 'iPhone X/Xs',
    resolution: {
      width: 375,
      height: 812,
    },
  },
  {
    id: 'ipad',
    label: 'iPad',
    resolution: {
      width: 768,
      height: 1024,
    },
  },
];

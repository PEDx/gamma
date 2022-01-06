import React from 'react';
import ReactDOM from 'react-dom';

import {
  RuntimeElement,
  ViewDataContainer,
  Resource,
  viewDataHelper,
  createPolysemyConfigurator,
} from '@gamma/runtime';

const runtime = {
  RuntimeElement,
  Resource,
  viewDataHelper,
  ViewDataContainer,
  createPolysemyConfigurator,
};

//@ts-ignore
window['@gamma/runtime'] = runtime;
window['ReactDOM'] = ReactDOM;
window['React'] = React;

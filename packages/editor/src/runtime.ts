import React from 'react';
import ReactDOM from 'react-dom';

import {
  RuntimeElement,
  ViewDataContainer,
  ElementType,
  Resource,
  viewDataHelper,
  createPolysemyConfigurator,
} from '@gamma/runtime';

const runtime = {
  ElementType,
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

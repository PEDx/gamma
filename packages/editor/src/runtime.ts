import React from 'react';
import ReactDOM from 'react-dom';

import {
  ConfiguratorValueType,
  RuntimeElement,
  ViewDataContainer,
  ElementType,
  Resource,
  viewDataHelper,
  createPolysemyConfigurator,
  createConfigurator,
} from '@gamma/runtime';

const runtime = {
  ConfiguratorValueType,
  ElementType,
  RuntimeElement,
  Resource,
  createConfigurator,
  viewDataHelper,
  ViewDataContainer,
  createPolysemyConfigurator,
};

//@ts-ignore
window['@gamma/runtime'] = runtime;
window['ReactDOM'] = ReactDOM;
window['React'] = React;

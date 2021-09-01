import React from 'react';
import ReactDOM from 'react-dom';

import {
  ConfiguratorValueType,
  RuntimeElement,
  ElementType,
  createConfigurator,
  viewDataHelper,
  ViewDataContainer,
  createPolysemyConfigurator,
  Resource,
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

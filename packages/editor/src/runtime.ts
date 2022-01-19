import React from 'react';
import ReactDOM from 'react-dom';

import { Resource } from '@gamma/runtime';

const runtime = {
  Resource,
};

//@ts-ignore
window['@gamma/runtime'] = runtime;
window['ReactDOM'] = ReactDOM;
window['React'] = React;

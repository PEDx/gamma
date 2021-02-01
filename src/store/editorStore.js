import { createContext } from 'react';

export const initState = {
  viewport_device: 'widget2x',
  viewport_scale: 1,
  editing_widget: [],
};

export const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case 'set_viewport_device':
      return Object.assign({}, state, { viewport_device: data });
    case 'set_viewport_scale':
      return Object.assign({}, state, { viewport_scale: data });
    default:
      return state;
  }
};

export const EditorStore = createContext('EditorStore');

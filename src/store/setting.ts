import { createContext } from 'react';

interface IEditorState {
  viewport_device: string;
  viewport_scale: number;
}

export const initState: IEditorState = {
  viewport_device: 'widget2x',
  viewport_scale: 1,
};

export const reducer = (state: IEditorState, action: any) => {
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

export const SettingContext =
  createContext<{ dispatch: React.Dispatch<any>; state: IEditorState } | null>(
    null,
  );

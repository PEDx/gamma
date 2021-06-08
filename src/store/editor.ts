import { createContext } from 'react';
import { EditBoxLayer, EditBoxLayerMethods } from '@/components/EditBoxLayer';

interface IEditorState {
  drag_destination: HTMLDivElement | null;
  edit_box_layer: EditBoxLayerMethods | null;
}

interface IEditorAction {
  type: string;
  data: any;
}

export const initState: IEditorState = {
  drag_destination: null,
  edit_box_layer: null,
};

export const reducer = (state: IEditorState, action: IEditorAction) => {
  const { type, data } = action;
  switch (type) {
    case 'set_drag_destination':
      return { ...state, drag_destination: data };
    case 'set_edit_box_layer':
      return { ...state, edit_box_layer: data };
    default:
      return state;
  }
};

export const EditorContext =
  createContext<{
    dispatch: React.Dispatch<IEditorAction>;
    state: IEditorState;
  } | null>(null);

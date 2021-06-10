import { createContext } from 'react';
import { ViewData } from '@/class/ViewData';
import { EditBoxLayerMethods } from '@/components/EditBoxLayer';

interface IEditorState {
  drag_destination: HTMLDivElement | null;
  edit_box_layer: EditBoxLayerMethods | null;
  select_view_data: ViewData | null;
}

interface IEditorAction {
  type: string;
  data: any;
}

export const initState: IEditorState = {
  drag_destination: null,
  edit_box_layer: null,
  select_view_data: null,
};

export const reducer = (state: IEditorState, action: IEditorAction) => {
  const { type, data } = action;
  switch (type) {
    case 'set_drag_destination':
      return { ...state, drag_destination: data };
    case 'set_edit_box_layer':
      return { ...state, edit_box_layer: data };
    case 'set_select_view_data':
      return { ...state, select_view_data: data };
    default:
      return state;
  }
};

export const EditorContext =
  createContext<{
    dispatch: React.Dispatch<IEditorAction>;
    state: IEditorState;
  } | null>(null);

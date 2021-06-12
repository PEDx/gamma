import { createContext, useReducer, useContext, FC } from 'react';
import { ViewData } from '@/class/ViewData';
import { EditBoxLayerMethods } from '@/components/EditBoxLayer';

interface IEditorState {
  edit_box_layer: EditBoxLayerMethods | null;
  select_view_data: ViewData | null;
}

interface IEditorAction {
  type: string;
  data: any;
}

const initState: IEditorState = {
  edit_box_layer: null,
  select_view_data: null,
};

const reducer = (state: IEditorState, action: IEditorAction) => {
  const { type, data } = action;
  switch (type) {
    case 'set_edit_box_layer':
      return { ...state, edit_box_layer: data };
    case 'set_select_view_data':
      return { ...state, select_view_data: data };
    default:
      return state;
  }
};

const noop = () => {};

const EditorStateContext = createContext<IEditorState>(initState);

const EditoDispatchContext = createContext<React.Dispatch<IEditorAction>>(noop);

export function useEditorState() {
  return useContext(EditorStateContext);
}
export function useEditorDispatch() {
  return useContext(EditoDispatchContext);
}

export const EditorStoreProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <EditorStateContext.Provider value={state}>
      <EditoDispatchContext.Provider value={dispatch}>
        {children}
      </EditoDispatchContext.Provider>
    </EditorStateContext.Provider>
  );
};

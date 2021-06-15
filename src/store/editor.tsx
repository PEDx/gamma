import { createContext, useReducer, useContext, FC } from 'react';
import { ViewData } from '@/class/ViewData';
import { noop } from '@/utils';

export enum ActionType {
  SetSelectViewData,
}
interface SetSelectViewData {
  type: ActionType.SetSelectViewData;
  data: ViewData | null;
}

interface IEditorState {
  selectViewData: ViewData | null;
}

type EditorAction = SetSelectViewData;

const initState: IEditorState = {
  selectViewData: null,
};


const reducer = (state: IEditorState, action: EditorAction): IEditorState => {
  switch (action.type) {
    case ActionType.SetSelectViewData:
      return { ...state, selectViewData: action.data };
    default:
      return state;
  }
};

const EditorStateContext = createContext<IEditorState>(initState);

const EditoDispatchContext = createContext<React.Dispatch<EditorAction>>(noop);

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

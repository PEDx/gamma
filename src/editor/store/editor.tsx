import { createContext, useReducer, useContext, FC } from 'react';
import { ViewData } from '@/runtime/ViewData';
import { LayoutViewData } from '@/runtime/LayoutViewData';
import { noop } from '@/utils';

export enum ActionType {
  SetActiveViewData,
  SetLayoutViewData,
}
interface SetActiveViewData {
  type: ActionType.SetActiveViewData;
  data: ViewData | null;
}
interface SetLayoutViewData {
  type: ActionType.SetLayoutViewData;
  data: LayoutViewData | null;
}

interface IEditorState {
  activeViewData: ViewData | null;
  layoutViewData: LayoutViewData | null;
}

export type EditorAction = SetActiveViewData | SetLayoutViewData;

const initState: IEditorState = {
  activeViewData: null,
  layoutViewData: null,
};

const reducer = (state: IEditorState, action: EditorAction): IEditorState => {
  switch (action.type) {
    case ActionType.SetActiveViewData:
      return { ...state, activeViewData: action.data };
    case ActionType.SetLayoutViewData:
      return { ...state, layoutViewData: action.data };
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

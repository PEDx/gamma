import { createContext, useReducer, useContext, FC } from 'react';
import { ViewData } from '@gamma/runtime';
import { RootViewData } from '@gamma/runtime';
import { noop } from '@/utils';

export enum ActionType {
  SetActiveViewData,
  SetRootViewData,
}
interface SetActiveViewData {
  type: ActionType.SetActiveViewData;
  data: ViewData | null;
}
interface SetRootViewData {
  type: ActionType.SetRootViewData;
  data: RootViewData | null;
}

interface IEditorState {
  activeViewData: ViewData | null;
  rootViewData: RootViewData | null;
}

export type EditorAction = SetActiveViewData | SetRootViewData;

const initState: IEditorState = {
  activeViewData: null,
  rootViewData: null,
};

const reducer = (state: IEditorState, action: EditorAction): IEditorState => {
  switch (action.type) {
    case ActionType.SetActiveViewData:
      return { ...state, activeViewData: action.data };
    case ActionType.SetRootViewData:
      return { ...state, rootViewData: action.data };
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

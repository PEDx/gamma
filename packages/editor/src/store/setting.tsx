import { createContext, useReducer, useContext, FC, useEffect } from 'react';
import { useStorageState } from '@/hooks/useStorageState';
import { noop, ViewportDevice } from '@/utils';

export enum ActionType {
  SetViewportDevice,
}
interface SetViewportDevice {
  type: ActionType.SetViewportDevice;
  data: ViewportDevice | null;
}

interface ISettingState {
  viewportDevice: ViewportDevice | null;
}

type SettingAction = SetViewportDevice;

const initState: ISettingState = {
  viewportDevice: null,
};

const reducer = (
  state: ISettingState,
  action: SettingAction,
): ISettingState => {
  switch (action.type) {
    case ActionType.SetViewportDevice:
      return { ...state, viewportDevice: action.data };
    default:
      return state;
  }
};

const SettingStateContext = createContext<ISettingState>(initState);

const EditoDispatchContext = createContext<React.Dispatch<SettingAction>>(noop);

export function useSettingState() {
  return useContext(SettingStateContext);
}
export function useSettingDispatch() {
  return useContext(EditoDispatchContext);
}

// read storage => state init => state change => write storage
// 这个编辑器设置 store 是本地持久化的


export const SettingPersistStoreProvider: FC = ({ children }) => {
  const [storageState, setStorageState] = useStorageState<ISettingState>(
    `setting_store`,
    initState,
  );

  const [state, dispatch] = useReducer(reducer, storageState);

  useEffect(() => {
    setStorageState(state);
  }, [state]);

  return (
    <SettingStateContext.Provider value={storageState}>
      <EditoDispatchContext.Provider value={dispatch}>
        {children}
      </EditoDispatchContext.Provider>
    </SettingStateContext.Provider>
  );
};

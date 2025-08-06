import { produce } from 'immer';
import { createContext, useContext, useReducer } from 'react';

interface TRootContext {
  state: TState;
  dispatch: React.Dispatch<TAction>;
}

interface TState {
  isMobile: boolean;
  user: string | null;
}

type TAction =
  | { type: 'SET_IS_MOBILE'; data: boolean }
  | { type: 'SET_USER'; data: string | null };

const RootContext = createContext<TRootContext | null>(null);

export function RootProvider({ children }: any) {
  const initialState = {
    isMobile: window.innerWidth < 576,
    user: localStorage.getItem('user_id'),
  };

  const rootReducer = produce((state = initialState, action: TAction) => {
    switch (action.type) {
      case 'SET_IS_MOBILE':
        state.isMobile = action.data;
        break;
      case 'SET_USER':
        state.user = action.data;
        break;
    }
  });

  const [state, dispatch] = useReducer(rootReducer, initialState);

  return (
    <RootContext.Provider value={{ state, dispatch }}>
      { children }
    </RootContext.Provider>
  );
}

export function useRootContext() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error("Unable to obtain RootContext");
  }
  return context;
}

import { produce } from "immer";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useReducer } from "react";
import { Outlet } from "react-router-dom";

import Titlebar from "@/Titlebar";

interface TRootContext {
  state: TState;
  dispatch: React.Dispatch<any>;
}

type TAction =
  | { type: 'SET_IS_MOBILE'; data: boolean }
  | { type: 'SET_USER'; data: string | null };

interface TState {
  isMobile: boolean;
  user: string | null;
}

const RootContext = createContext<TRootContext | null>(null);

export function useRootContext() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error("Unable to obtain RootContext");
  }
  return context;
}

function Root() {
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
  const initialState = {
    isMobile: window.innerWidth < 576,
    user: Cookies.get('user') || null,
  };
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    const handleResize = () => {
      dispatch({ type: 'SET_IS_MOBILE', data: window.innerWidth < 576 })
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <RootContext.Provider value={{ state, dispatch }}>
      <div className="root-content">
        <Titlebar />
        <Outlet />
      </div>
    </RootContext.Provider>
  );
}

export default Root;

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
    throw new Error("RootContext must be used within a RootContext.Provider");
  }
  return context;
}

function Root() {
  const initialState = {
    isMobile: window.innerWidth < 576,
    user: Cookies.get('user') || null,
  };
  const [state, dispatch] = useReducer(rootReducer, initialState);

  function rootReducer(state = initialState, action: TAction) {
    switch (action.type) {
      case 'SET_IS_MOBILE':
        return { ...state, isMobile: action.data };
      case 'SET_USER':
        return { ...state, user: action.data };
      default:
        return state;
    }
  }

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

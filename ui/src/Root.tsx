import Cookies from "js-cookie";
import { createContext, useContext, useReducer } from "react";
import { Outlet } from "react-router-dom";

import Titlebar from "./Titlebar";

interface TRootContext {
  state: TState;
  dispatch: React.Dispatch<any>;
}

type TAction =
  | { type: 'SET_USER'; data: string | null };

interface TState {
  user: string | null;
}

const RootContext = createContext<TRootContext | null>(null);

export function useRootContext() {
  const context = useContext(RootContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContext.Provider");
  }
  return context;
}

function App() {
  const initialState = { user: Cookies.get('user') || null };
  const [state, dispatch] = useReducer(appReducer, initialState);

  function appReducer(state = initialState, action: TAction) {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.data };
      default:
        return state;
    }
  }

  return (
    <RootContext.Provider value={{ state, dispatch }}>
      <div className="root-content">
        <Titlebar />
        <Outlet />
      </div>
    </RootContext.Provider>
  );
}

export default App;

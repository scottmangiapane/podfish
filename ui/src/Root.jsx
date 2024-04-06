import Cookies from "js-cookie";
import { createContext, useReducer } from "react";
import { Outlet } from "react-router-dom";

import Titlebar from "./Titlebar";

export const RootContext = createContext();

function App() {
  const initialState = { user: Cookies.get('user') };
  const [state, dispatch] = useReducer(appReducer, initialState);

  function appReducer(state = initialState, action) {
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

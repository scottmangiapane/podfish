import Cookies from "js-cookie";
import { createContext, useReducer } from "react";
import { Outlet } from "react-router-dom";

export const RootContext = createContext();

function App() {
  const initialState = { user: Cookies.get('user') };
  const [state, dispatch] = useReducer(appReducer, initialState);

  function appReducer(state, action) {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.data }
      default:
        return initialState;
    }
  }

  return (
    <RootContext.Provider value={{ state, dispatch }}>
      <Outlet />
    </RootContext.Provider>
  );
}

export default App;

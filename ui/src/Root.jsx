import Cookies from "js-cookie";
import { createContext, useReducer } from "react";
import { Outlet } from "react-router-dom";

import Playbar from "./Playbar";
import Titlebar from "./Titlebar";

export const RootContext = createContext();

function Root() {
  const initialState = { nowPlaying: true, user: Cookies.get('user') };
  const [state, dispatch] = useReducer(appReducer, initialState);

  function appReducer(state, action) {
    switch (action.type) {
      case 'SET_NOW_PLAYING':
        return { ...state, nowPlaying: action.data }
      case 'SET_USER':
        return { ...state, user: action.data }
      default:
        return initialState;
    }
  }

  const paddingBottom = state.nowPlaying && 'calc(32px + var(--playbar-height))';

  return (
    <>
      <RootContext.Provider value={{ state, dispatch }}>
        <Titlebar />
        <div className="app-body" style={{ paddingBottom }}>
          <div className="app-content">
            <Outlet />
          </div>
        </div>
        { state.nowPlaying && <Playbar />}
      </RootContext.Provider>
    </>
  );
}

export default Root;

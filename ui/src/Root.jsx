import Cookies from "js-cookie";
import { createContext, useEffect, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getNowPlaying } from "./api-service";
import Playbar from "./Playbar";
import Titlebar from "./Titlebar";

export const RootContext = createContext();

function Root() {
  const initialState = { nowPlaying: null, user: Cookies.get('user') };
  const [state, dispatch] = useReducer(appReducer, initialState);

  function appReducer(state, action) {
    switch (action.type) {
      case 'SET_NOW_PLAYING':
        const { id, episodeTitle, podcastTitle } = action.data;
        return { ...state, nowPlaying: { id, episodeTitle, podcastTitle } }
      case 'SET_USER':
        return { ...state, user: action.data }
      default:
        return initialState;
    }
  }

  const navigate = useNavigate();
  useEffect(() => {
    getNowPlaying(navigate).then((data) => {
      if (data.ok) {
        dispatch({ type: 'SET_NOW_PLAYING', data: {
          id: data['episode_id'],
          episodeTitle: data['episode_title'],
          podcastTitle: data['podcast_title']
        } });
      }
    });
  }, []);

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

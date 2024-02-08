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

  const navigate = useNavigate();

  useEffect(() => {
    getNowPlaying(navigate).then((res) => {
      res.json().then((data) => {
        if (res.ok && Object.keys(data).length > 0) {
          dispatch({ type: 'SET_NOW_PLAYING', data: {
            episodeId: data['episode_id'],
            episodeTitle: data['episode_title'],
            podcastId: data['podcast_id'],
            podcastTitle: data['podcast_title']
          } });
        } else {
          dispatch({ type: 'SET_NOW_PLAYING', data: null });
        }
      });
    });
  }, []);

  function appReducer(state, action) {
    switch (action.type) {
      case 'SET_NOW_PLAYING':
        if (action.data === null) {
          return { ...state, nowPlaying: null };
        } else {
          const { id, episodeTitle, podcastTitle } = action.data;
          return { ...state, nowPlaying: { id, episodeTitle, podcastTitle } }
        }
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

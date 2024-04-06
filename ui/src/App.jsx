import { createContext, useEffect, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getNowPlaying } from "./api-service";
import Playbar from "./Playbar";

export const AppContext = createContext();

function App() {
  const initialState = { nowPlaying: null };
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useNavigate();

  useEffect(() => {
    getNowPlaying(navigate).then((res) => {
      res.json().then((data) => {
        if (res.ok && Object.keys(data).length > 0) {
          dispatch({ type: 'SET_NOW_PLAYING', data: {
            episodeId: data.episode['episode_id'],
            episodeTimestamp: data.episode.timestamp,
            episodeTitle: data.episode.title,
            episodeUrl: data.episode.url,
            podcastId: data.podcast['podcast_id'],
            podcastTitle: data.podcast.title
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
          const { episodeId, episodeTitle, episodeUrl, podcastTitle } = action.data;
          return { ...state, nowPlaying: { episodeId, episodeTitle, episodeUrl, podcastTitle } }
        }
      default:
        return initialState;
    }
  }

  const paddingBottom = state.nowPlaying && 'calc(32px + var(--playbar-height))';

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="app-content" style={{ paddingBottom }}>
        <Outlet />
        { state.nowPlaying && <Playbar />}
      </div>
    </AppContext.Provider>
  );
}

export default App;

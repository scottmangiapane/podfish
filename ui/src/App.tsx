import { createContext, useContext, useEffect, useReducer } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getNowPlaying } from "@/api-service";
import Playbar from "@/Playbar";

interface TAppContext {
  state: TState,
  dispatch: React.Dispatch<TAction>;
};

type TAction =
  | { type: 'SET_NOW_PLAYING'; data: TNowPlaying | null };

// TODO can this be replaced with TNowPlaying from types file?
interface TNowPlaying {
  episodeId: string;
  episodeTitle: string;
  episodeUrl: string;
  podcastId: string;
  podcastTitle: string;
};

interface TState {
  nowPlaying: {
    episodeTitle: string;
    episodeUrl: string;
    podcastTitle: string;
  } | null;
};

const AppContext = createContext<TAppContext | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppContext.Provider");
  }
  return context;
}

function App() {
  const initialState = { nowPlaying: null };
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useNavigate();

  useEffect(() => {
    getNowPlaying(navigate).then((res) => {
      if (res.ok && res.data && Object.keys(res.data).length > 0) {
        dispatch({ type: 'SET_NOW_PLAYING', data: {
          episodeId: res.data.episode['episode_id'],
          episodeTitle: res.data.episode.title,
          episodeUrl: res.data.episode.url,
          podcastId: res.data.podcast['podcast_id'],
          podcastTitle: res.data.podcast.title,
          // TODO include current timestamp
        } });
      } else {
        dispatch({ type: 'SET_NOW_PLAYING', data: null });
      }
    });
  }, []);

  function appReducer(state: TState, action: TAction) {
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

  const paddingBottom = state.nowPlaying ? 'calc(32px + var(--playbar-height))' : undefined;

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

import { produce } from "immer";
import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import type { TNowPlaying } from "./types";

import { getNowPlaying } from "@/api-service";
import Playbar from "@/Playbar";

interface TAppContext {
  state: TState,
  dispatch: React.Dispatch<TAction>;
};

type TAction =
  | { type: 'AUDIO_DURATION_CHANGE'; data: number; }
  | { type: 'AUDIO_PLAY'; }
  | { type: 'AUDIO_PAUSE'; }
  | { type: 'AUDIO_SKIP'; data: number; }
  | { type: 'AUDIO_TIME_UPDATE'; data: number; }
  | { type: 'AUDIO_TOGGLE'; }
  | { type: 'SET_NOW_PLAYING'; data: TNowPlaying | null; };

interface TState {
  audio: {
    currentTime: number;
    duration: number;
    isPaused: boolean;
    requestedTime: number;
  }
  nowPlaying: TNowPlaying | null;
};

const AppContext = createContext<TAppContext | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Unable to obtain AppContext");
  }
  return context;
}

function App() {
    const appReducer = produce((state: TState, action: TAction) => {
    switch (action.type) {
      case 'AUDIO_DURATION_CHANGE':
        state.audio.duration = action.data;
        break;
      case 'AUDIO_PAUSE':
        state.audio.isPaused = true;
        break;
      case 'AUDIO_PLAY':
        state.audio.isPaused = false;
        break;
      case 'AUDIO_SKIP':
        state.audio.requestedTime = action.data;
        break;
      case 'AUDIO_TIME_UPDATE':
        state.audio.currentTime = action.data;
        break;
      case 'AUDIO_TOGGLE':
        state.audio.isPaused = !state.audio.isPaused;
        break;
      case 'SET_NOW_PLAYING':
        if (action.data === null) {
          state.nowPlaying = null;
        } else {
          state.nowPlaying = action.data;
          state.audio.requestedTime = action.data.position["current_time"];
        }
        break;
    }
  });

  const initialState = {
    audio: {
      currentTime: 0,
      duration: 0,
      isPaused: true,
      requestedTime: 0,
    },
    nowPlaying: null,
  };
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useNavigate();

  useEffect(() => {
    getNowPlaying(navigate).then((res) => {
      if (res.ok && res.data && Object.keys(res.data).length > 0) {
        dispatch({ type: 'SET_NOW_PLAYING', data: res.data });
      }
    });
  }, []);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.audio.isPaused) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [state.audio.isPaused]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = state.audio.requestedTime
    }
  }, [state.audio.requestedTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener('durationchange', audioDurationChange);
    audio.addEventListener('ended', audioEnded);
    audio.addEventListener('pause', audioPause);
    audio.addEventListener('play', audioPlay);
    audio.addEventListener('timeupdate', audioTimeUpdate);
    document.addEventListener('keydown', spacebarPressed);
    return () => {
      audio.removeEventListener('durationchange', audioDurationChange);
      audio.removeEventListener('ended', audioEnded);
      audio.removeEventListener('pause', audioPause);
      audio.removeEventListener('play', audioPlay);
      audio.removeEventListener('timeupdate', audioTimeUpdate);
      document.removeEventListener('keydown', spacebarPressed);
    }
  }, []);

  function audioEnded() { /* TODO call `PATCH /episodes/{id}/completed` */ }

  function audioDurationChange() {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: 'AUDIO_DURATION_CHANGE', data: audio.duration })
  }

  function audioPause() { dispatch({ type: 'AUDIO_PAUSE' }); }

  function audioPlay() { dispatch({ type: 'AUDIO_PLAY' }); }

  function audioTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    dispatch({ type: 'AUDIO_TIME_UPDATE', data: audio.currentTime });
  }

  function spacebarPressed(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      dispatch({ type: 'AUDIO_TOGGLE' })
    }
  }

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <audio ref={ audioRef } src={ state.nowPlaying?.episode.url } preload="metadata"></audio>
      <div
        className="app-content"
        style={{ paddingBottom: state.nowPlaying
          ? 'calc(32px + var(--playbar-height))'
          : undefined }}>
        <Outlet />
        { state.nowPlaying && <Playbar />}
      </div>
    </AppContext.Provider>
  );
}

export default App;

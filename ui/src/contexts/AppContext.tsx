import { produce } from 'immer';
import { createContext, useContext, useReducer } from 'react';

import type { TNowPlaying } from '@/types';

interface TAppContext {
  state: TState,
  dispatch: React.Dispatch<TAction>;
};

type TAction =
  | { type: 'AUDIO_DURATION_CHANGE'; data: number; }
  | { type: 'AUDIO_PLAY'; }
  | { type: 'AUDIO_PAUSE'; }
  | { type: 'AUDIO_SKIP'; data: number | null; }
  | { type: 'AUDIO_TIME_UPDATE'; data: number; }
  | { type: 'AUDIO_TOGGLE'; }
  | { type: 'SET_IS_LOADING'; data: boolean; }
  | { type: 'SET_NOW_PLAYING'; data: TNowPlaying | null; }
  | { type: 'SET_HAS_USER_INTERACTED'; }
  | { type: 'SYNC_POSITION'; data: { currentTime: number; realDuration: number; }; };

interface TState {
  audio: {
    isPaused: boolean;
    requestedTime: number | null;
  };
  isLoading: boolean;
  hasUserInteracted: boolean;
  nowPlaying: TNowPlaying | null;
  positionLastSynced: number | null;
};

const AppContext = createContext<TAppContext | null>(null);

export function AppProvider({ children }: any) {
  const initialState = {
    audio: {
      isPaused: true,
      requestedTime: null,
    },
    isLoading: false,
    hasUserInteracted: false,
    nowPlaying: null,
    positionLastSynced: null,
  };

  const appReducer = produce((state: TState, action: TAction) => {
    switch (action.type) {
      case 'AUDIO_DURATION_CHANGE':
        if (state.nowPlaying) {
          state.nowPlaying.position = state.nowPlaying.position || {
            completed: false,
            currentTime: 0,
            realDuration: action.data,
          }
          state.nowPlaying.position.realDuration = action.data;
        }
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
        if (state.nowPlaying) {
          state.nowPlaying.position = state.nowPlaying.position || {
            completed: false,
            currentTime: action.data,
            realDuration: state.nowPlaying.episode.duration,
          }
          state.nowPlaying.position.currentTime = action.data;
        }
        break;
      case 'AUDIO_TOGGLE':
        state.audio.isPaused = !state.audio.isPaused;
        break;
      case 'SET_IS_LOADING':
        state.isLoading = action.data;
        break;
      case 'SET_NOW_PLAYING':
        if (action.data === null) {
          state.nowPlaying = null;
        } else {
          state.nowPlaying = action.data;
          state.audio.requestedTime = action.data.position?.currentTime || null;
        }
        break;
      case 'SET_HAS_USER_INTERACTED':
        state.hasUserInteracted = true;
        break;
      case 'SYNC_POSITION':
        state.positionLastSynced = Date.now();
        break;
    }
  });

  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      { children }
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("Unable to obtain AppContext");
  }
  return context;
}


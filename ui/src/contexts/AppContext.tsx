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
  | { type: 'SYNC_CURRENT_TIME'; data: number }
  | { type: 'SET_NOW_PLAYING'; data: TNowPlaying | null; };

interface TState {
  audio: {
    currentTime: number;
    duration: number;
    isPaused: boolean;
    requestedTime: number | null;
  };
  nowPlaying: TNowPlaying | null;
  syncCurrentTime: {
    lastSync: number | null;
    previousTime: number
  };
};

const AppContext = createContext<TAppContext | null>(null);

export function AppProvider({ children }: any) {
  const initialState = {
    audio: {
      currentTime: 0,
      duration: 0,
      isPaused: true,
      requestedTime: null,
    },
    nowPlaying: null,
    syncCurrentTime: {
      lastSync: null,
      previousTime: 0,
    },
  };

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
          state.audio.requestedTime = action.data.position?.currentTime || null;
        }
        break;
      case 'SYNC_CURRENT_TIME':
        state.syncCurrentTime.lastSync = Date.now();
        state.syncCurrentTime.previousTime = action.data;
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


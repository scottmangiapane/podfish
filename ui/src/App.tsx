import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getNowPlaying, patchEpisodeProgress } from "@/api-service";
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import Playbar from "@/components/Playbar";

function AppWithContext() {
  const { dispatch, state } = useAppContext();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (state.audio.isPaused) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [state.audio.isPaused]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.removeAttribute("src");
    audio.load(); // TODO should I also load before play/pause?

    const playWhenReady = () => audio.play();
    if (state.nowPlaying?.episode.url) {
      audio.src = state.nowPlaying?.episode.url;
      audio.addEventListener("canplay", playWhenReady, { once: true });
      return () => audio.removeEventListener("canplay", playWhenReady);
    }
  }, [state.nowPlaying?.episode.url]);

  useEffect(() => {
    if (!state.nowPlaying) return;
    if (!state.audio.currentTime || !state.audio.duration) return;
    const { lastSync, previousTime } = state.syncCurrentTime;
    if (lastSync === null || Date.now() - lastSync > 5 * 1000) {
      const newCurrentTime = state.audio.currentTime;
      if (previousTime !== newCurrentTime) {
        patchEpisodeProgress(
          navigate,
          state.nowPlaying.episode.episodeId,
          false,
          Math.round(newCurrentTime),
          Math.round(state.audio.duration),
        );
        dispatch({ type: 'SYNC_CURRENT_TIME', data: newCurrentTime });
      }
    }
  }, [state.audio.currentTime]);

  useEffect(() => {
    if (audioRef.current && state.audio.requestedTime !== null) {
      audioRef.current.currentTime = state.audio.requestedTime;
      dispatch({ type: 'AUDIO_SKIP', data: null });
    }
  }, [state.audio.requestedTime]);

  useEffect(() => {
    getNowPlaying(navigate).then((res) => {
      if (res.ok && res.data && Object.keys(res.data).length > 0) {
        dispatch({ type: 'SET_NOW_PLAYING', data: res.data });
      }
    });
  }, []);

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

  function audioEnded() {
    // TODO: the following doesn't work because event listeners only know the default state... use ref instead?
    // if (!state.nowPlaying) return;
    // patchEpisodeProgress(
    //   navigate,
    //   state.nowPlaying?.episode.episodeId,
    //   true,
    //   0,
    // );
  }

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
    <>
      <audio ref={ audioRef } preload="metadata"></audio>
      <div
        className="app-content"
        style={{ paddingBottom: state.nowPlaying
          ? 'calc(32px + var(--playbar-height))'
          : '32px' }}>
        <Outlet />
        { state.nowPlaying && <Playbar />}
      </div>
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppWithContext />
    </AppProvider>
  );
}

export default App;

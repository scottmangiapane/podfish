import { useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getNowPlaying, patchEpisodePosition } from "@/api-service";
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

    const handleLoadStart = () => dispatch({ type: 'SET_IS_LOADING', data: true });
    const handleCanPlay = () => dispatch({ type: 'SET_IS_LOADING', data: false });
    const handlePlaying = () => dispatch({ type: 'SET_IS_LOADING', data: false });
    const handleWaiting = () => dispatch({ type: 'SET_IS_LOADING', data: true });

    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("waiting", handleWaiting);

    const playWhenReady = () => audio.play();
    if (state.nowPlaying?.episode.url) {
      audio.src = state.nowPlaying?.episode.url;
      if (state.hasUserInteracted) {
        audio.addEventListener("canplay", playWhenReady, { once: true });
      }
    }

    return () => {
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", playWhenReady);
    };
  }, [state.nowPlaying?.episode.url]);

  useEffect(() => {
    if (!state.nowPlaying?.position) return;
    if (state.positionLastSynced === null || Date.now() - state.positionLastSynced > 5 * 1000) {
      const { currentTime, realDuration } = state.nowPlaying.position;
        patchEpisodePosition(
          navigate,
          state.nowPlaying.episode.episodeId,
          false,
          Math.round(currentTime),
          Math.round(realDuration),
        );
        dispatch({ type: 'SYNC_POSITION', data: {
          currentTime,
          realDuration,
        } });
    }
  }, [state.nowPlaying?.position?.currentTime]);

  useEffect(() => {
    if (audioRef.current && state.audio.requestedTime !== null) {
      audioRef.current.currentTime = state.audio.requestedTime;
      dispatch({ type: 'AUDIO_SKIP', data: null });
    }
  }, [state.audio.requestedTime]);

  useEffect(() => {
    getNowPlaying(navigate).then((res) => {
      if (res.ok && res.data) {
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
    // TODO: attaching to document breaks text inputs
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
    // TODO: does it even matter?
    // if (!state.nowPlaying) return;
    // patchEpisodePosition(
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
      dispatch({ type: 'SET_HAS_USER_INTERACTED' });
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

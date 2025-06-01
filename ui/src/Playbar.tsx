import { useEffect, useRef, useState } from "react";

import { useAppContext } from "@/App";
import { useRootContext } from "@/Root";
import Slider from "@/Slider";

import "@/Playbar.css";

function Playbar() {
  const { state: appState } = useAppContext();
  const { state: rootState } = useRootContext();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [_isPaused, _setIsPaused] = useState(true);
  const isPausedRef = useRef(_isPaused);
  function setIsPaused(isPaused: boolean) {
    isPausedRef.current = isPaused;
    _setIsPaused(isPaused);
  }

  function secondsToTimestamp(totalSeconds: number) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return (totalSeconds > 3600)
      ? `${h}:${m}:${s}`
      : `${m}:${s}`;
  }

  function spacebarPressed(event: KeyboardEvent) {
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlayPause();
    }
  }

  function togglePlayPause() {
    if (isPausedRef.current) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }

  useEffect(() => {
    // if (appState.nowPlaying.timestamp) {
    //   console.log(appState.nowPlaying.timestamp);
    //   skipToTime(appState.nowPlaying.timestamp);
    // }
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

  function audioEnded() { /* TODO */ }

  function audioDurationChange() {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration);
  }

  function audioPause() { setIsPaused(true); }

  function audioPlay() { setIsPaused(false); }

  function audioTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  }

  function skipToTime(seconds: number) {
    const audio = audioRef.current;
    if (!audio) return;
    seconds = Math.max(0, seconds);
    seconds = Math.min(audio.duration, seconds);
    audio.currentTime = seconds;
  }

  const slider = (
    <Slider
      labelEnd={ secondsToTimestamp(duration) }
      labelStart={ secondsToTimestamp(currentTime) }
      onChange={ (percent: number) => { skipToTime(audioRef.current!.duration * percent / 100) } }
      value={ 100 * currentTime / duration }
    />
  );

  if (!appState.nowPlaying) return null;
  const { episodeTitle, episodeUrl, podcastTitle } = appState.nowPlaying;

  const mobileControls = (
    <span className="btn symbol symbol-play-pause" onClick={ togglePlayPause }>
      { (isPausedRef.current) ? "play_circle" : "pause_circle" }
    </span>
  );

  const desktopControls = <>
    <div className="center flex-2">
      <div className="playbar-symbol-group">
        <span
          className="btn symbol"
          onClick={ () => { skipToTime(currentTime - 10); } }>
            replay_10
        </span>
        <span className="btn symbol symbol-play-pause" onClick={ togglePlayPause }>
          { (isPausedRef.current) ? "play_circle" : "pause_circle" }
        </span>
        <span
          className="btn symbol"
          onClick={ () => { skipToTime(currentTime + 30); } }>
            forward_30
        </span>
      </div>
      { slider }
    </div>
    <div className="flex-1">
      <div className="align-right">
        <span className="btn symbol">volume_up</span>
        {/* <span className="btn symbol">volume_down</span> */}
        {/* <span className="btn symbol">volume_mute</span> */}
      </div>
    </div>
  </>;

  return (
    <div>
      <audio ref={ audioRef } src={ episodeUrl } preload="metadata"></audio>
      <div className="playbar app-content">
        { rootState.isMobile && slider }
        <div className="flex-1">
          <p className="truncate">{ episodeTitle }</p>
          <p className="text-light truncate">{ podcastTitle }</p>
        </div>
        { rootState.isMobile ? mobileControls : desktopControls }
      </div>
    </div>
  )
}

export default Playbar;

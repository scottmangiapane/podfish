import { useContext, useEffect, useRef, useState } from "react";

import { AppContext } from "./App";
import Slider from "./Slider";

import "./Playbar.css";

function Playbar() {
  const { state } = useContext(AppContext);
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [_isPaused, _setIsPaused] = useState(true);
  const isPausedRef = useRef(_isPaused);
  function setIsPaused(data) {
    isPausedRef.current = data;
    _setIsPaused(data);
  }

  function secondsToTimestamp(seconds) {
    // TODO
    // show hours if applicable
    // what if podcast episode is longer than a day?
    return new Date(seconds * 1000).toISOString().slice(11, 19);
  }

  function spacebarPressed(event) {
    if (event.code === 'Space') {
      event.preventDefault();
      togglePlayPause();
    }
  }

  function togglePlayPause() {
    if (isPausedRef.current) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }

  useEffect(() => {
    // skipToTime(state.nowPlaying.timestamp);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
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

  function audioDurationChange() { setDuration(audioRef.current.duration); }

  function audioPause() { setIsPaused(true); }

  function audioPlay() { setIsPaused(false); }

  function audioTimeUpdate() { setCurrentTime(audioRef.current.currentTime); }

  function skipToTime(seconds) {
    seconds = Math.max(0, seconds);
    seconds = Math.min(audioRef.current.duration, seconds);
    audioRef.current.currentTime = seconds;
  }

  const { episodeTitle, episodeUrl, podcastTitle } = state.nowPlaying;
  return (
    <div className="app-content playbar">
      <audio ref={ audioRef } src={ episodeUrl } preload="metadata"></audio>
      <div className="flex-1">
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
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
        <Slider
          labelEnd={ secondsToTimestamp(duration) }
          labelStart={ secondsToTimestamp(currentTime) }
          onChange={ (percent) => { skipToTime(audioRef.current.duration * percent / 100) } }
          value={ 100 * currentTime / duration }
        />
      </div>
      <div className="flex-1">
        <div className="align-right">
          <span className="btn symbol">volume_up</span>
          {/* <span className="btn symbol">volume_down</span> */}
          {/* <span className="btn symbol">volume_mute</span> */}
        </div>
      </div>
    </div>
  )
}

export default Playbar;

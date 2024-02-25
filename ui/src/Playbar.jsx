import { useContext, useEffect, useRef, useState } from "react";

import { RootContext } from "./Root";
import Slider from "./Slider";

import "./Playbar.css";

function Playbar() {
  const { state } = useContext(RootContext);
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
    const audio = audioRef.current;
    audio.addEventListener('durationchange', durationChange);
    audio.addEventListener('pause', pause);
    audio.addEventListener('play', play);
    audio.addEventListener('seeked', seeked);
    audio.addEventListener('seeking', seeking);
    audio.addEventListener('timeupdate', timeUpdate);
    return () => {
      audio.removeEventListener('durationchange', durationChange);
      audio.removeEventListener('pause', pause);
      audio.removeEventListener('play', play);
      audio.removeEventListener('seeked', seeked);
      audio.removeEventListener('seeking', seeking);
      audio.removeEventListener('timeupdate', timeUpdate);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', spacebarPressed);
    return () => { document.removeEventListener('keydown', spacebarPressed) }
  }, []);

  function durationChange() { setDuration(audioRef.current.duration); }

  function pause() { setIsPaused(true); }

  function play() { setIsPaused(false); }

  function seeked() {}

  function seeking() {}

  function timeUpdate() { setCurrentTime(audioRef.current.currentTime); }

  const { episodeTitle, episodeUrl, podcastTitle } = state.nowPlaying;
  return (
    <div className="app-content playbar">
      <audio ref={ audioRef } src={ episodeUrl } preload="metadata"></audio>
      <div className="playbar-stretch">
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
      <div className="center playbar-stretch">
        <div className="playbar-symbol-group">
          <span className="btn symbol">replay_10</span>
          <span className="btn symbol symbol-play-pause" onClick={ togglePlayPause }>
            { (isPausedRef.current) ? "play_circle" : "pause_circle" }
          </span>
          <span className="btn symbol">forward_30</span>
        </div>
        <div className="playbar-labeled-slider">
          <p>{ secondsToTimestamp(currentTime) }</p>
          <Slider
            min="0"
            max="1000"
            value={ 100 * currentTime / duration }
            onChange={ () => { /* TODO */ } }
          />
          <p>{ secondsToTimestamp(duration) }</p>
        </div>
      </div>
      <div className="playbar-stretch">
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

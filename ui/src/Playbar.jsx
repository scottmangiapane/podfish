import { useContext, useEffect, useRef, useState } from "react";

import { RootContext } from "./Root";
import Slider from "./Slider";

import "./Playbar.css";

function Playbar() {
  const { state } = useContext(RootContext);
  const audioRef = useRef(null);
  const [playbackPosition, setPlaybackPosition] = useState(30);

  const [_isPaused, _setIsPaused] = useState(true);
  const isPausedRef = useRef(_isPaused);
  function setIsPaused(data) {
    isPausedRef.current = data;
    _setIsPaused(data);
  }

  function changePlaybackPosition(percent) {
    setPlaybackPosition(percent);
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
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', spacebarPressed);
    return () => { document.removeEventListener('keydown', spacebarPressed) }
  }, []);

  const { episodeTitle, episodeUrl, podcastTitle } = state.nowPlaying;

  return (
    <div className="app-content playbar">
      <audio ref={ audioRef } src={ episodeUrl } preload="metadata"></audio>
      <div className="playbar-stretch">
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
      <div>
        <div className="playbar-symbol-group">
          <span className="btn symbol">replay_10</span>
          <span className="btn symbol symbol-play-pause" onClick={ togglePlayPause }>
            { (isPausedRef.current) ? "play_circle" : "pause_circle" }
          </span>
          <span className="btn symbol">forward_30</span>
        </div>
        <Slider
          min="0"
          max="1000"
          value={ playbackPosition }
          onChange={ changePlaybackPosition }
        />
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

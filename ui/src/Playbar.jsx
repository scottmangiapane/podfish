import { useContext, useRef, useState } from "react";

import { RootContext } from "./Root";

import "./Playbar.css";

function Playbar() {
  const { state } = useContext(RootContext);
  const audioRef = useRef(null);
  const [isPaused, setIsPaused] = useState(true);

  const { episodeTitle, episodeUrl, podcastTitle } = state.nowPlaying;

  const playPause = () => {
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="app-content playbar">
      <audio ref={ audioRef } src={ episodeUrl } preload="metadata"></audio>
      <div className="playbar-stretch">
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
      <div className="playbar-symbol-group">
        <span className="btn symbol">replay_10</span>
        <span className="btn symbol symbol-play-pause" onClick={ playPause }>
          { (isPaused) ? "play_circle" : "pause_circle" }
        </span>
        <span className="btn symbol">forward_30</span>
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

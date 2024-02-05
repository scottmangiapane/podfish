import { useContext, useState } from "react";

import { RootContext } from "./Root";

import "./Playbar.css";

function Playbar() {
  const { state } = useContext(RootContext);
  const [isPaused, setIsPaused] = useState(false);

  const { episodeTitle, podcastTitle } = state.nowPlaying;

  const playPause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div className="app-content playbar">
      <div className="playbar-stretch">
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
      <div className="playbar-symbol-group">
        <span className="symbol symbol-btn">replay_10</span>
        <span className="symbol symbol-btn symbol-play-pause" onClick={ playPause }>
          { (isPaused) ? "play_circle" : "pause_circle" }
        </span>
        <span className="symbol symbol-btn">forward_30</span>
      </div>
      <div className="playbar-stretch">
        <div className="align-right">
          <span className="symbol symbol-btn">volume_up</span>
          {/* <span className="symbol symbol-btn">volume_down</span> */}
          {/* <span className="symbol symbol-btn">volume_mute</span> */}
        </div>
      </div>
    </div>
  )
}

export default Playbar;

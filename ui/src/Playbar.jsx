import { useContext } from "react";

import { RootContext } from "./Root";

import "./Playbar.css";

function Playbar() {
  const { state } = useContext(RootContext);

  const { episodeTitle, podcastTitle } = state.nowPlaying;

  return (
    <div className="app-content playbar">
      <div>
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
      <div>
        <div className="align-center playbar-symbol-group">
          <span className="symbol symbol-btn">replay_10</span>
          <span className="symbol symbol-btn symbol-play-pause">play_circle</span>
          {/* <span className="symbol symbol-btn symbol-play-pause">pause_circle</span> */}
          <span className="symbol symbol-btn">forward_30</span>
        </div>
      </div>
      <div>
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

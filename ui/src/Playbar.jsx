import "./Playbar.css";

function Playbar() {
  return (
    <div className="app-content playbar">
      <div>
        <p>Episode Title</p>
        <p>Podcast Title</p>
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

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
          <span className="symbol">replay_10</span>
          <span className="symbol symbol-big">play_circle</span>
          {/* <span className="symbol symbol-big">pause_circle</span> */}
          <span className="symbol">forward_30</span>
        </div>
      </div>
      <div>
        <div className="align-right">
          <span className="symbol">volume_up</span>
          {/* <span className="symbol">volume_down</span> */}
          {/* <span className="symbol">volume_mute</span> */}
        </div>
      </div>
    </div>
  )
}

export default Playbar;

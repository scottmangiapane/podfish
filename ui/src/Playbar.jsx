import "./Playbar.css";

function Playbar() {
  return (
    <div className="app-content playbar">
      <div>
        <p>Episode Title</p>
        <p>Podcast Title</p>
      </div>
      <div className="playbar-symbol-group">
        <span className="playbar-symbol symbol">replay_10</span>
        <span className="playbar-symbol symbol">play_circle</span>
        {/* <span className="playbar-symbol symbol">pause_circle</span> */}
        <span className="playbar-symbol symbol">forward_30</span>
      </div>
      <span className="playbar-symbol symbol">volume_up</span>
      {/* <span className="playbar-symbol symbol">volume_down</span>
      <span className="playbar-symbol symbol">volume_mute</span> */}
    </div>
  )
}

export default Playbar;

import "./Playbar.css";

function Playbar() {
  return (
    <div className="app-content playbar">
      <div>
        {/* TODO can these overflow? */}
        <p>Episode Title</p>
        <p>Podcast Title</p>
      </div>
      {/* TODO why doesn't this work? */}
      <div className="text-center">
        <div className="playbar-symbol-group">
          <span className="symbol">replay_10</span>
          <span className="symbol symbol-big">play_circle</span>
          {/* <span className="symbol symbol-big">pause_circle</span> */}
          <span className="symbol">forward_30</span>
        </div>
      </div>
      <div className="text-right">
        <span className="content-right symbol">volume_up</span>
        {/* <span className="symbol">volume_down</span>
        <span className="symbol">volume_mute</span> */}
      </div>
    </div>
  )
}

export default Playbar;

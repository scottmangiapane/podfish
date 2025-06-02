import { useAppContext } from "@/App";
import { useRootContext } from "@/Root";
import Slider from "@/Slider";

import "@/Playbar.css";

function Playbar() {
  const { dispatch, state } = useAppContext();
  const { state: rootState } = useRootContext();

  function secondsToTimestamp(totalSeconds: number) {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return (totalSeconds > 3600)
      ? `${h}:${m}:${s}`
      : `${m}:${s}`;
  }

  const slider = (
    <Slider
      labelEnd={ secondsToTimestamp(state.audio.duration) }
      labelStart={ secondsToTimestamp(state.audio.currentTime) }
      onChange={ (percent: number) => {
        dispatch({
          type: 'AUDIO_SKIP',
          data: state.audio.duration * percent / 100
        });
      }}
      value={ 100 * state.audio.currentTime / state.audio.duration }
    />
  );

  if (!state.nowPlaying) return null;
  const { episodeTitle, podcastTitle } = state.nowPlaying;

  const simpleControls = (
    <span
      className="btn symbol symbol-play-pause"
      onClick={ () => dispatch({ type: "AUDIO_TOGGLE" }) }>
      { (state.audio.isPaused) ? "play_circle" : "pause_circle" }
    </span>
  );

  const fullControls = (
    <>
      <div className="center flex-2">
        <div className="playbar-symbol-group">
          <span
            className="btn symbol"
            onClick={ () => { dispatch({
              type: 'AUDIO_SKIP',
              data: Math.max(0, state.audio.currentTime - 10)
            }); } }>
            replay_10
          </span>
          { simpleControls }
          <span
            className="btn symbol"
            onClick={ () => { dispatch({
              type: 'AUDIO_SKIP',
              data: Math.min(state.audio.duration, state.audio.currentTime + 30)
            }); } }>
            forward_30
          </span>
        </div>
        { slider }
      </div>
      <div className="flex-1">
        <div className="align-right">
          <span className="btn symbol">volume_up</span>
          {/* <span className="btn symbol">volume_down</span> */}
          {/* <span className="btn symbol">volume_mute</span> */}
        </div>
      </div>
    </>
  );

  return (
    <div className="playbar app-content">
      { rootState.isMobile && slider }
      <div className="flex-1">
        <p className="truncate">{ episodeTitle }</p>
        <p className="text-light truncate">{ podcastTitle }</p>
      </div>
      { rootState.isMobile ? simpleControls : fullControls }
    </div>
  )
}

export default Playbar;

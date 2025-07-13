import { useAppContext } from "@/contexts/AppContext";
import { useRootContext } from "@/contexts/RootContext";
import Slider from "@/components/Slider";

import "@/components/Playbar.css";

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
      labelEnd={ secondsToTimestamp(state.nowPlaying?.position?.realDuration || 0) }
      labelStart={ secondsToTimestamp(state.nowPlaying?.position?.currentTime || 0) }
      onChange={ (percent: number) => {
        dispatch({
          type: 'AUDIO_SKIP',
          data: (state.nowPlaying?.position?.realDuration || 0) * percent / 100
        });
      } }
      value={
        100
        * (state.nowPlaying?.position?.currentTime || 0)
        / (state.nowPlaying?.position?.realDuration || 0)
      }
    />
  );

  if (!state.nowPlaying) return null;
  const episodeTitle = state.nowPlaying.episode.title;
  const podcastTitle = state.nowPlaying.podcast.title;

  const simpleControls = (
    <span
      className="btn symbol symbol-play-pause"
      onClick={ () => dispatch({ type: "AUDIO_TOGGLE" }) }>
      { (state.audio.isPaused) ? "play_circle" : "pause_circle" }
    </span>
  );

  const fullControls = (
    <>
      <div className="center flex-1_5">
        <div className="playbar-symbol-group">
          <span
            className="btn symbol"
            onClick={ () => { dispatch({
              type: 'AUDIO_SKIP',
              data: Math.max(0, (state.nowPlaying?.position?.currentTime || 0) - 10)
            }); } }>
            replay_10
          </span>
          { simpleControls }
          <span
            className="btn symbol"
            onClick={ () => { dispatch({
              type: 'AUDIO_SKIP',
              data: Math.min(
                state.nowPlaying?.position?.realDuration || 0,
                (state.nowPlaying?.position?.currentTime || 0) + 30
              )
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
    <div className="playbar">
      { rootState.isMobile && slider }
      <div className="flex-1 playbar-metadata">
        <img className="playbar-cover" src={ `/file/${ state.nowPlaying.podcast.imageId }-sm.jpeg` }></img>
        <div className="playbar-metadata-text">
          <p className="truncate">{ episodeTitle }</p>
          <p className="text-light truncate">{ podcastTitle }</p>
        </div>
      </div>
      { rootState.isMobile ? simpleControls : fullControls }
    </div>
  )
}

export default Playbar;

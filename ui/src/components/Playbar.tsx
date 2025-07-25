import { useAppContext } from "@/contexts/AppContext";
import { useRootContext } from "@/contexts/RootContext";
import Cover from "@/components/Cover";
import Slider from "@/components/Slider";
import Forward30 from "@/symbols/Forward30";
import PauseCircle from "@/symbols/PauseCircle";
import PlayCircle from "@/symbols/PlayCircle";
import Replay10 from "@/symbols/Replay10";
import VolumeUp from "@/symbols/VolumeUp";

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

  let simpleControls = (
    <PauseCircle
      onClick={ () => {
        dispatch({ type: 'SET_HAS_USER_INTERACTED' });
        dispatch({ type: "AUDIO_TOGGLE" })
      } }
      fill="var(--theme-color)"
      size="lg" />
  );
  if (state.audio.isPaused) {
    simpleControls = (
      <PlayCircle
        onClick={ () => {
          dispatch({ type: 'SET_HAS_USER_INTERACTED' });
          dispatch({ type: "AUDIO_TOGGLE" })
        } }
        fill="var(--theme-color)"
        size="lg" />
    );
  }

  const fullControls = (
    <>
      <div className="center flex-1_5">
        <div className="playbar-symbol-group">
          <Replay10
            onClick={ () => { dispatch({
              type: 'AUDIO_SKIP',
              data: Math.max(0, (state.nowPlaying?.position?.currentTime || 0) - 10)
            }); } } />
          { simpleControls }
          <Forward30
            onClick={ () => { dispatch({
              type: 'AUDIO_SKIP',
              data: Math.min(
                state.nowPlaying?.position?.realDuration || 0,
                (state.nowPlaying?.position?.currentTime || 0) + 30
              )
            }); } } />
        </div>
        { slider }
      </div>
      <div className="flex-1">
        <div className="align-right">
          <VolumeUp />
          {/* <VolumeDown /> */}
          {/* <VolumeMute /> */}
        </div>
      </div>
    </>
  );

  return (
    <div className="playbar">
      { rootState.isMobile && slider }
      <div className="flex-1 playbar-metadata">
        <Cover
          className="playbar-cover"
          color={ state.nowPlaying.podcast.color }
          src={ `/file/${ state.nowPlaying.podcast.imageId }-sm.jpeg`} />
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

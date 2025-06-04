import { useState } from "react";
import { useNavigate } from "react-router-dom";
import sanitizeHtml from "sanitize-html";

import { putNowPlaying } from "@/api-service";
import { useAppContext } from '@/contexts/AppContext';
import type { TEpisode, TPodcast, TPosition } from "@/types";

import "@/podcast/Episode.css";

interface TEpisodeProps {
  episode: TEpisode;
  podcast: TPodcast;
  position: TPosition | null;
}

function Episode({ episode, podcast, position }: TEpisodeProps) {
  const { dispatch, state } = useAppContext();

  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  function cleanHtml(text: string) {
    return sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
    })
  }

  function formatDuration(seconds: number) {
    seconds = Math.floor(seconds);

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    } else {
      return `${pad(m)}:${pad(s)}`;
    }
  }

  let playButton = (
    <span className="btn symbol symbol-outline" onClick={ () => {
      dispatch({ type: 'SET_NOW_PLAYING', data: {
        episode,
        podcast,
        position,
      } });
      putNowPlaying(navigate, episode['episode_id']);
    } }>
      play_circle
    </span>
  );

  if (episode.episode_id === state.nowPlaying?.episode.episode_id) {
    const symbol = (state.audio.isPaused) ? 'play_circle' : 'pause_circle';
    playButton = (
      <span
        className="btn symbol symbol-outline"
        onClick={ () => dispatch({ type: 'AUDIO_TOGGLE' }) }>
        { symbol }
      </span>
    );
  }

  const realDuration = position?.['real_duration'] || episode.duration;
  let status = <p className="text-light">{ formatDuration(realDuration) }</p>;
  if (position?.completed
    || (position?.current_time && realDuration - position.current_time < 30)) {
    status = <p className="color-theme">Played</p>
  }
  else if (episode.episode_id === state.nowPlaying?.episode.episode_id) {
    const seconds = realDuration - state.audio.currentTime;
    status = <p className="episode-status-bold">{ formatDuration(seconds) } left</p>
  }
  else if (position?.current_time) {
    const seconds = realDuration - position.current_time;
    status = <p className="episode-status-bold">{ formatDuration(seconds) } left</p>
  }

  return (
    <>
      <div className="episode-header mb-2">
        { playButton }
        <div style={{ minWidth: 0 }}> {/* `minWidth: 0` is necessary for truncation */}
          <p className="episode-title truncate">{ episode.title }</p>
          <div className="episode-subtext">
            <p className="text-light truncate">{ new Date(episode.date).toDateString() }</p>
            <p className="text-light">·</p>
            <p className="truncate">{ status }</p>
          </div>
        </div>
      </div>
      <div className="episode-content">
        <p className={ "break-word " + (isCollapsed && "truncate-l truncate-3l") }>
          { cleanHtml(episode.description) }
        </p>
        <span className="btn symbol" onClick={ () => setIsCollapsed(!isCollapsed) }>
          { (isCollapsed) ? "expand_more" : "expand_less" }
        </span>
      </div>
    </>
  );
}

export default Episode;

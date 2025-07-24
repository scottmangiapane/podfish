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
    <img className="btn symbol symbol-outline" onClick={ () => {
      dispatch({ type: 'SET_HAS_USER_INTERACTED' });
      dispatch({ type: 'SET_NOW_PLAYING', data: {
        episode,
        podcast,
        position,
      } });
      putNowPlaying(navigate, episode.episodeId);
    } }
    src='/symbols/play_circle_24dp.svg' />
  );

  if (episode.episodeId === state.nowPlaying?.episode.episodeId) {
    playButton = (
      <img
        className="btn symbol symbol-outline"
        onClick={ () => dispatch({ type: 'AUDIO_TOGGLE' }) }
        src={ (state.audio.isPaused)
          ? '/symbols/play_circle_24dp.svg'
          : '/symbols/pause_circle_24dp.svg' } />
    );
  }

  const duration = position?.realDuration || episode.duration;
  let status = <span className="text-light">{ formatDuration(duration) }</span>;
  if (position?.completed
    || (position?.currentTime && duration - position.currentTime < 15)) {
    status = <span className="color-theme">Played</span>
  }
  else if (position?.currentTime) {
    const seconds = duration - position.currentTime;
    status = <span className="episode-status-bold">{ formatDuration(seconds) } left</span>
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
        <img
          className="btn symbol"
          onClick={ () => setIsCollapsed(!isCollapsed) }
          src={ (isCollapsed)
            ? "/symbols/unfold_more_24dp.svg"
            : "/symbols/unfold_less_24dp.svg" } />
      </div>
    </>
  );
}

export default Episode;

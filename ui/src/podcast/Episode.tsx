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
  const { dispatch } = useAppContext();

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

  function play() {
    dispatch({ type: 'SET_NOW_PLAYING', data: {
      episode,
      podcast,
      position,
    } });
    putNowPlaying(navigate, episode['episode_id']);
  }

  let status = <p className="text-light">{ formatDuration(episode.duration) }s</p>;
  if (position?.completed
    || (position?.current_time && episode.duration - position.current_time < 10)) {
    status = <p className="color-theme">Played</p>
  }
  else if ( position?.current_time) {
    const seconds = episode.duration - position.current_time;
    status = <p className="color-alert">{ formatDuration(seconds) }s left</p>
  }

  return (
    <>
      <div className="episode-header mb-2">
        <span className="btn symbol symbol-outline" onClick={ play }>
          play_circle
        </span>
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

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

  function play() {
    dispatch({ type: 'SET_NOW_PLAYING', data: {
      episode,
      podcast,
      position,
    } });
    putNowPlaying(navigate, episode['episode_id']);
  }

  const cleanDescription = sanitizeHtml(episode.description, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return (
    <>
      <div className="episode-header mb-2">
        <span className="btn symbol symbol-outline" onClick={ play }>
          play_circle
        </span>
        <div style={{ minWidth: 0 }}> {/* `minWidth: 0` is necessary for truncation */}
          <p className="episode-title truncate">{ episode.title }</p>
          <p className="text-light truncate">{ new Date(episode.date).toDateString() }</p>
          {/* TODO remove: */}
          {/* <p className="text-light truncate">{ 'Completed: ' + !!position?.completed}</p> */}
          {/* <p className="text-light truncate">{ 'Current Time: ' + (position?.["current_time"] || 0) }</p> */}
        </div>
      </div>
      <div className="episode-content">
        <p className={ "break-word " + (isCollapsed && "truncate-l truncate-3l") }>
          { cleanDescription }
        </p>
        <span className="btn symbol" onClick={ () => setIsCollapsed(!isCollapsed) }>
          { (isCollapsed) ? "expand_more" : "expand_less" }
        </span>
      </div>
    </>
  );
}

export default Episode;

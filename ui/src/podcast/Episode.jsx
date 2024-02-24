import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { putNowPlaying } from "../api-service";
import { RootContext } from '../Root';

import "./Episode.css";

function Episode({ episode, podcast }) {
  const { dispatch } = useContext(RootContext);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const play = () => {
    dispatch({ type: 'SET_NOW_PLAYING', data: {
      episodeId: episode['episode_id'],
      episodeTitle: episode.title,
      episodeUrl: episode.url,
      podcastId: podcast['podcast_id'],
      podcastTitle: podcast.title
    } });
    putNowPlaying(navigate, episode['episode_id']);
  };

  return (
    <>
      <div className="episode-header mb-2">
        <span className="btn symbol symbol-outline" onClick={ play }>
            play_circle
        </span>
        <div style={{ minWidth: 0 }}> {/* `minWidth: 0` is necessary for truncation */}
          <p className="episode-title truncate">{ episode.title }</p>
          <p className="text-light truncate">{ new Date(episode.date).toDateString() }</p>
        </div>
      </div>
      <div className="episode-content">
        <p className={ "break-word " + (isCollapsed && "truncate-l truncate-3l") }>
          { episode.description }
        </p>
        <span className="btn symbol" onClick={ () => setIsCollapsed(!isCollapsed) }>
          { (isCollapsed) ? "expand_more" : "expand_less" }
        </span>
      </div>
    </>
  );
}

export default Episode;

import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { putNowPlaying } from "../api-service";
import { RootContext } from '../Root';

import "./Episode.css";

function Episode({ id, title, description, date, podcastTitle }) {
  const { dispatch } = useContext(RootContext);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const play = () => {
    dispatch({ type: 'SET_NOW_PLAYING', data: {
      id,
      episodeTitle: title,
      podcastTitle
    } });
    putNowPlaying(navigate, id);
  };

  return (
    <>
      <div className="episode-header mb-2">
        <span className="symbol symbol-btn symbol-outline" onClick={ play }>
            play_circle
        </span>
        <div style={{ minWidth: 0 }}> {/* `minWidth: 0` is necessary for truncation */}
          <p className="episode-title truncate">{ title }</p>
          <p className="text-light truncate">{ new Date(date).toDateString() }</p>
        </div>
      </div>
      <div className="episode-content">
        <p className={ "break-word " + (isCollapsed && "truncate-l truncate-3l") }>
          { description }
        </p>
        <span className="symbol symbol-btn" onClick={ () => setIsCollapsed(!isCollapsed) }>
          { (isCollapsed) ? "expand_more" : "expand_less" }
        </span>
      </div>
    </>
  );
}

export default Episode;

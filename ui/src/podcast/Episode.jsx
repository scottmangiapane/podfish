import { useState } from "react";

import "./Episode.css";

function Episode({ title, description, date }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div>
      <div className="episode-header mb-2">
        <span className="symbol symbol-outline">play_circle</span>
        <div>
          <p className="episode-title">{ title }</p>
          <p className="episode-date">{ new Date(date).toDateString() }</p>
        </div>
      </div>
      <div className="episode-content">
        <p className={ "break-word " + (isCollapsed && "truncate-l truncate-3l") }>
          { description }
        </p>
        <span className="symbol" onClick={ () => setIsCollapsed(!isCollapsed) }>
          { (isCollapsed) ? "expand_more" : "expand_less" }
        </span>
      </div>
    </div>
  );
}

export default Episode;

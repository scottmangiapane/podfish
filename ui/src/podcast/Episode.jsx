import { useState } from "react";

import "./Episode.css";

function Episode({ title, description, date }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="episode">
      <span className="symbol symbol-outline">play_circle</span>
      <div>
        <p className="episode-title">{ title }</p>
        <p className="episode-date">{ new Date(date).toDateString() }</p>
        <p className={ "break-word mb-2 mt-2 " + (isCollapsed && "episode-collapsed") }>
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

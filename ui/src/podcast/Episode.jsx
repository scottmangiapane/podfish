import { useState } from "react";

import "./Episode.css";

function Episode({ title, description, date }) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <>
      <div className="episode-header mb-2">
        <span className="symbol symbol-outline">play_circle</span>
        <div style={{ minWidth: 0 }}> {/* `minWidth: 0` is necessary for truncation */}
          <p className="episode-title truncate">{ title }</p>
          <p className="episode-date truncate">{ new Date(date).toDateString() }</p>
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
    </>
  );
}

export default Episode;

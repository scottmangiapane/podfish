import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEpisodes, getSubscription } from "../api-service";
import Episode from "./Episode";

import "./Podcast.css";

function Podcast() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [episodes, setEpisodes] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    getEpisodes(navigate, id).then((res) => {
      res.json().then((data) => setEpisodes(data));
    });
    getSubscription(navigate, id).then((res) => {
      res.json().then((data) => setPodcast(data));
    });
  }, []);

  if (!podcast) {
    return null;
  }

  const episodeList = [];
  // TODO do something with position
  for (const { episode, position } of episodes) {
    episodeList.push(
      <div className="podcast-list-item" key={ episode["episode_id"] }>
        <Episode episode={ episode } podcast={ podcast } />
      </div>
    );
  }

  return (
    <div className="podcast-split">
      <div className="podcast-split-left">
        <div className="podcast-header">
          <img className="podcast-cover" src={ `/file/${ podcast['image_id'] }` }></img>
          <div className="break-word">
            <h3 className="break-word podcast-title">{ podcast.title }</h3>
            <p className={ "break-word " + (isCollapsed && "truncate-l truncate-6l") }>
              { podcast.description }
            </p>
            <span className="btn symbol" onClick={ () => setIsCollapsed(!isCollapsed) }>
              { (isCollapsed) ? "expand_more" : "expand_less" }
            </span>
            {/* TODO unsubscribe button? */}
          </div>
        </div>
      </div>
      <div className="podcast-split-right">
        <div className="podcast-list">
          { episodeList }
        </div>
      </div>
    </div>
  );
}

export default Podcast;

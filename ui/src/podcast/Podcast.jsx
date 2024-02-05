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
    getEpisodes(navigate, id).then((data) => {
      setEpisodes(data);
    });
    getSubscription(navigate, id).then((data) => {
      setPodcast(data);
    });
  }, []);

  if (!podcast) {
    return null;
  }

  const episodeList = [];
  for (const episode of episodes) {
    episodeList.push(
      <div className="podcast-list-item">
        <Episode
          key={ episode.id }
          title={ episode.title }
          description={ episode.description }
          date={ episode.date }
          />
      </div>
    );
  }

  return (
    <div className="podcast-split">
      <div className="podcast-split-left">
        <div className="podcast-header">
          <img className="podcast-cover" src={ `/file/${ podcast['image_id'] }` }></img>
          <h3 className="break-word podcast-title">{ podcast.title }</h3>
        </div>
        <p className={ "break-word " + (isCollapsed && "truncate-l truncate-6l") }>
          { podcast.description }
        </p>
        <span className="symbol symbol-btn" onClick={ () => setIsCollapsed(!isCollapsed) }>
          { (isCollapsed) ? "expand_more" : "expand_less" }
        </span>
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

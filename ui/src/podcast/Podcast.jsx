import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEpisodes, getSubscription } from "../api-service";
import Episode from "./Episode";

import "./Podcast.css";

function Podcast() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [episodes, setEpisodes] = useState([]);
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
      <Episode
        key={ episode.id }
        title={ episode.title }
        description={ episode.description }
        date={ episode.date }
        />
    );
  }

  return (
    <div className="podcast-split">
      <div className="podcast-split-left">
        <div className="text-center">
          <img className="podcast-cover" src={ `/file/${ podcast['image_id'] }` }></img>
          <h1 className="break-word">{ podcast.title }</h1>
        </div>
        <p className="break-word">{ podcast.description }</p>
      </div>
      <div className="podcast-split-right">
        <div className="episode-list">{ episodeList }</div>
      </div>
    </div>
  );
}

export default Podcast;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getSubscription } from "../api-service";

import "./Podcast.css";

function Podcast() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [podcast, setPodcast] = useState(null);

  useEffect(() => {
    getSubscription(navigate, id).then((data) => {
      setPodcast(data);
    });
  }, []);

  if (!podcast) {
    return null;
  }

  return (
    <>
      <h1>{ podcast.title }</h1>
      <div className="podcast-content">
        <div className="episode-list">
          <h2>All Episodes</h2>
          <p>TODO: episode list</p>
        </div>
        <div className="podcast-metadata">
          <img
            className="podcast-cover"
            src={ `/file/${ podcast['image_id'] }` }>
          </img>
          <p>{ podcast.description }</p>
        </div>
      </div>
    </>
  );
}

export default Podcast;

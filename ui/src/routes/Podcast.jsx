import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getEpisodes, getSubscription } from "../api-service";
import Episode from "../Episode";

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

  const content = [];
  for (const episode of episodes) {
    content.push(
      <Episode
        key={ episode.id }
        title={ episode.title }
        description={ episode.description }
        date={ episode.date }
        />
    );
  }

  return (
    <>
      <h1>{ podcast.title }</h1>
      {/* <img src={ `/file/${ podcast['image_id'] }` }></img>
      <p>{ podcast.description }</p> */}
      { content }
    </>
  );
}

export default Podcast;

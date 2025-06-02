import { Link } from "react-router-dom";

import type { TPodcast } from "@/types";

import "@/home/Subscription.css";

interface TSubscriptionProps {
  podcast: TPodcast
}

function Subscription({ podcast }: TSubscriptionProps) {
  return (
    <Link className="uncolored" to={`/podcasts/${ podcast.podcast_id }`}>
      <img className="subscription-cover" src={ `/file/${ podcast.image_id }` }></img>
      <div className="truncate">{ podcast.title }</div>
    </Link>
  );
}

export default Subscription;

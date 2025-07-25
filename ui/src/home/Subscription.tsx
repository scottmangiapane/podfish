import { Link } from "react-router-dom";

import Cover from "@/components/Cover";
import type { TPodcast } from "@/types";

import "@/home/Subscription.css";

interface TSubscriptionProps {
  podcast: TPodcast;
}

function Subscription({ podcast }: TSubscriptionProps) {
  return (
    <Link className="uncolored" to={`/podcasts/${ podcast.podcastId }`}>
      <Cover
        className="subscription-cover"
        color={ podcast.color }
        src={ `/file/${ podcast.imageId }-md.jpeg` } />
      <div className="truncate">{ podcast.title }</div>
    </Link>
  );
}

export default Subscription;

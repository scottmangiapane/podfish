import { Link } from "react-router-dom";

import Cover from "@/components/Cover";
import type { TPodcast } from "@/types";

interface TSubscriptionProps {
  podcast: TPodcast;
}

function Subscription({ podcast }: TSubscriptionProps) {
  return (
    <Link className="uncolored" to={`/podcasts/${ podcast.podcastId }`}>
      <Cover
        color={ podcast.color }
        src={ `/file/${ podcast.imageId }-md.jpeg` }
        style={{
          borderRadius: "8px",
          boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, "
            + "rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
          overflow: "hidden",
          width: "100%",
        }} />
    </Link>
  );
}

export default Subscription;

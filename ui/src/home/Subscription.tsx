import { Link } from "react-router-dom";

import "./Subscription.css";

interface TSubscriptionProps {
  id: string;
  imageId: string;
  title: string;
}

function Subscription({ id, imageId, title }: TSubscriptionProps) {
  return (
    <Link className="uncolored" to={`/podcasts/${ id }`}>
      <img className="subscription-cover" src={ `/file/${ imageId }` }></img>
      <div className="truncate">{ title }</div>
    </Link>
  );
}

export default Subscription;

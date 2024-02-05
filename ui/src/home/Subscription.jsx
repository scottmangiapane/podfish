import { Link } from "react-router-dom";

import "./Subscription.css";

function Subscription({ id, imageId, title }) {
  return (
    <Link className="uncolored" to={`/podcasts/${ id }`}>
      <img className="subscription-cover" src={ `/file/${ imageId }` }></img>
      <div className="truncate">{ title }</div>
    </Link>
  );
}

export default Subscription;

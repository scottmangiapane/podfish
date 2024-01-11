import { Link } from "react-router-dom";

import "./Subscription.css";

function Subscription({ id, imageId, title }) {
  return (
    <Link to={`/subscriptions/${ id }`}>
      <img className="subscription-cover" src={ `/file/${ imageId }` }></img>
      <p className="truncate">{ title }</p>
    </Link>
  );
}

export default Subscription;

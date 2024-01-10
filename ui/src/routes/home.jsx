import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSubscriptions } from "../api-service";
import Subscription from "../Subscription";

import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubscriptions(navigate).then((data) => {
      setSubscriptions(data);
    });
  }, []);

  const content = [];
  for (const subscription of subscriptions) {
    content.push(<Subscription key={ subscription.id } rss={ subscription.rss }></Subscription>);
  }

  return (
    <>
      <div className="subscription-grid">
        { content }
      </div>
      <button className="btn btn-pill mt-3">Add RSS Link</button>
    </>
  );
}

export default Home;

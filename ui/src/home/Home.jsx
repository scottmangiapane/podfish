import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSubscriptions } from "../api-service";
import Subscription from "./Subscription";

import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubscriptions(navigate).then((res) => {
      res.json().then((data) => setSubscriptions(data));
    });
  }, []);

  const content = [];
  for (const subscription of subscriptions) {
    content.push(
      <Subscription
        key={ subscription["podcast_id"] }
        id={ subscription["podcast_id"] }
        imageId={ subscription['image_id'] }
        title={ subscription.title } />
    );
  }

  return (
    <>
      <h1 className="mt-0">Subscriptions</h1>
      <div className="subscription-grid">
        { content }
      </div>
      <button className="btn btn-pill mt-3">Add RSS Link</button>
    </>
  );
}

export default Home;

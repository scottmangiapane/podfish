import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getSubscriptions } from "@/api-service";
import Subscription from "@/home/Subscription";
import type { TSubscription } from "@/types";

import "@/home/Home.css";

function Home() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState<TSubscription[]>([]);

  useEffect(() => {
    getSubscriptions(navigate).then((response) => setSubscriptions(response.data));
  }, []);

  const content = subscriptions.map(subscription => (
    <Subscription
      key={ subscription['podcast_id'] }
      id={ subscription['podcast_id'] }
      imageId={ subscription['image_id'] }
      title={ subscription.title } />
  ));

  return (
    <>
      <h1 className="mt-0">Subscriptions</h1>
      <div className="subscription-grid">
        { content }
      </div>
      <Link to={"/subscribe"}>
        <button className="btn btn-pill mt-3">Add Subscription</button>
      </Link>
    </>
  );
}

export default Home;

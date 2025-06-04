import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { postSubscription } from "@/api-service";

import "@/subscribe/Subscribe.css";

function Subscribe() {
  const navigate = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      inputRef.current?.focus();
    }, []);

  function subscribe(formData: FormData) {
    const rss = formData.get('rss');
    if (rss) {
      // TODO add loading indicator
      postSubscription(navigate, rss.toString());
    }
  }

  return (
    <div>
      <h1 className="mt-0">Subscribe</h1>
      <div className="subscribe-form">
        <div>
          <p>Have an RSS Feed?</p>
          <p>Drop it in below to subscribe to a podcast that's not already in your list.</p>
        </div>
        <div>
          <p>RSS feeds usually look like:</p>
          <code>https://example.com/podcast/feed.xml</code>
        </div>
        <form className="form" action={ subscribe }>
          <input ref={ inputRef } name="rss" type="url"></input>
          <button className="btn btn-pill" type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
}

export default Subscribe;

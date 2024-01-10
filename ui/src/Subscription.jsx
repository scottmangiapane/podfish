import { useEffect, useState } from "react";

import "./Subscription.css";

function Subscription({ rss }) {
  const [description, setDescription] = useState(null);
  const [iconUrl, setIconUrl] = useState(null);
  const [title, setTitle] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(rss, { method: "GET" });

      const parser = new DOMParser();
      const content = await res.text();
      const xml = parser.parseFromString(content, "text/xml");

      setDescription(xml
        .querySelector("channel")
        .querySelector("description")
        .childNodes[0]
        .nodeValue);

      setIconUrl(xml
        .querySelector("channel")
        .querySelector("image")
        .querySelector("url")
        .childNodes[0]
        .nodeValue);

      setTitle(xml
        .querySelector("channel")
        .querySelector("title")
        .childNodes[0]
        .nodeValue);
    }

    fetchData();
  }, []);

  if (iconUrl && title) {
    return (
      <div className="subscription">
        <img className="cover-icon" src={ iconUrl }></img>
        <p className="truncate">{ title }</p>
      </div>
    );
  }
  return null;
}

export default Subscription;

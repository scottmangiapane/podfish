import { useState } from "react";

import "@/components/Cover.css";

interface TCoverProps {
  color: string;
  src: string;
  style?: React.CSSProperties;
}

function Cover({ color, src, style }: TCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  function onLoad() {
    setIsLoaded(true);
  }

  return (
    <div
      style={{
        aspectRatio: 1,
        backgroundColor: color,
        display: "inline-block",
        position: "relative",
        ...style
      }}>
      {!isLoaded && (
        <div className="cover-placeholder" />
      )}
      <img
        className="cover-image"
        loading="lazy"
        onLoad={ onLoad }
        src={ src }
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  )
}

export default Cover;

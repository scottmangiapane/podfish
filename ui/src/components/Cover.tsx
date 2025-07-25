import { useState } from "react";

import "@/components/Cover.css";

interface TCoverProps {
  className?: string;
  color: string;
  src: string;
}

function Cover({ className, color, src }: TCoverProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  function onLoad() {
    setIsLoaded(true);
  }

  return (
    <div
      className={ className }
      style={{
        aspectRatio: 1,
        backgroundColor: color,
        display: "inline-block",
        position: "relative",
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

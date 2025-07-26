import { useLayoutEffect, useRef, useState } from "react";

import ArrowDown from "@/symbols/ArrowDown";
import ArrowUp from "@/symbols/ArrowUp";

interface TCollapsableProps {
    lines?: 3 | 6;
    text: string;
};

function Collapsable({ lines, text }: TCollapsableProps) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isOverflowingCollapsed, setIsOverflowingCollapsed] = useState(false);

  const className = (lines === 3) ? "truncate-l truncate-3l" : "truncate-l truncate-6l";

  function measureCollapsedOverflow() {
    const el = textRef.current;
    if (!el) return;

    const prevClass = el.className;
    el.className = "break-word " + className;

    const { scrollHeight, clientHeight } = el;
    setIsOverflowingCollapsed(scrollHeight > clientHeight);

    el.className = prevClass;
  }

  useLayoutEffect(() => {
    measureCollapsedOverflow();

    if (!textRef.current) return;

    const observer = new ResizeObserver(() => measureCollapsedOverflow());
    observer.observe(textRef.current);

    return () => observer.disconnect();
  }, [measureCollapsedOverflow, text]);

  const arrow = isCollapsed
    ? <ArrowDown onClick={() => setIsCollapsed(false)} />
    : <ArrowUp onClick={() => setIsCollapsed(true)} />;

  return (
    <>
      <p
        ref={textRef}
        className={"break-word " + (isCollapsed && className)}
      >
        {text}
      </p>
      {isOverflowingCollapsed && arrow}
    </>
  );
}

export default Collapsable;

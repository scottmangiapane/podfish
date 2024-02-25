import { useEffect, useRef, useState } from "react";

import "./Slider.css";

export default function Slider({ onChange, onInput, value }) {
  const barRef = useRef(null);
  const markerRef = useRef(null);

  // ref is used because state isn't updated inside of event listeners created by useEffect
  const mouseRef = useRef({});
  const isMouseDownRef = useRef(false);

  // ref is used because state isn't updated inside of event listeners created by useEffect
  // state is still needed to trigger re-renders
  const [_valuePending, _setValuePending] = useState(value);
  const valuePendingRef = useRef(_valuePending);
  function setValuePending(data) {
    valuePendingRef.current = data;
    _setValuePending(data);
  }

  useEffect(() => {
    if (!isMouseDownRef.current) {
      setValuePending(value);
    }
  }, [value]);

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  function onMouseDown(event) {
    const marker = markerRef.current;
    marker.style.cursor = 'grabbing';

    mouseRef.current ={ event, offset: marker.offsetLeft };
    isMouseDownRef.current = true;

    const percent = calculatePercent(event.clientX || event.touches?.[0]?.clientX);
    setValuePending(percent);
    onInput && onInput(percent);
  }

  function onMouseMove(event) {
    if (isMouseDownRef.current) {
      const percent = calculatePercent(event.clientX || event.touches?.[0]?.clientX);
      setValuePending(percent);
      onInput && onInput(percent);
    }
  }

  function onMouseUp() {
    if (isMouseDownRef.current) {
      markerRef.current.style.cursor = null;
      isMouseDownRef.current = false;
      onChange && onChange(valuePendingRef.current);
    }
  }

  function calculatePercent(mouseX) {
    const barWidth = barRef.current.clientWidth;
    const barX = barRef.current.getBoundingClientRect().left;
    let percent = 100 * (mouseX - barX) / barWidth;
    percent = Math.max(0, percent);
    percent = Math.min(100, percent);
    return percent;
  }

  const percent = valuePendingRef.current
  return (
    <div className="slider" onMouseDown={ onMouseDown } onTouchStart={ onMouseDown }>
      <div ref={ barRef } className="slider-bar">
        <div className="slider-bar-bg"></div>
        <div
          className="slider-bar-bg slider-bar-bg-active"
          style={{ width: `calc( ${ percent }%)` }}>
        </div>
      </div>
      <div
        ref={ markerRef }
        className="slider-marker"
        style={{
          backgroundColor: isMouseDownRef.current && 'var(--accent-color-dark)',
          left: `calc(${ percent }% - var(--marker-size) / 2)`
        }}>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

import "./Slider.css";

export default function Slider({ onChange, onInput, value }) {
  const barRef = useRef(null);
  const markerRef = useRef(null);

  // state can't be accessed inside event listeners created by useEffect
  const [_mouse, _setMouse] = useState({});
  const mouseRef = useRef(_mouse);
  function setMouse(data) {
    mouseRef.current = data;
    _setMouse(data);
  }

  // state can't be accessed inside event listeners created by useEffect
  const [_isMouseDown, _setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(_isMouseDown);
  function setIsMouseDown(data) {
    isMouseDownRef.current = data;
    _setIsMouseDown(data);
  }

  // state can't be accessed inside event listeners created by useEffect
  const [_valuePending, _setValuePending] = useState(value);
  const valuePendingRef = useRef(_valuePending);
  function setValuePending(data) {
    valuePendingRef.current = data;
    _setValuePending(data);
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function onClick(event) {
    const barWidth = barRef.current.clientWidth;
    const barX = barRef.current.getBoundingClientRect().left;

    let percent = 100 * (event.clientX - barX) / barWidth;
    percent = Math.max(0, percent);
    percent = Math.min(100, percent);

    setValuePending(percent);
    onChange && onChange(percent);
  }

  function onMouseDown(event) {
    const marker = markerRef.current;
    marker.style.cursor = 'grabbing';
    setMouse({
      event,
      offset: marker.offsetLeft
    });
    setIsMouseDown(true);
  }

  function onMouseMove(event) {
    const barWidth = barRef.current.clientWidth;
    const isMouseDown = isMouseDownRef.current;
    const markerWidth = markerRef.current.clientWidth;
    const mouse = mouseRef.current;

    if (isMouseDown) {
      const delta = event.clientX - mouse.event.clientX;

      let percent = 100 * (mouse.offset + delta + markerWidth / 2) / barWidth;
      percent = Math.max(0, percent);
      percent = Math.min(100, percent);

      setValuePending(percent);
      onInput && onInput(percent);
    }
  }

  function onMouseUp() {
    if (isMouseDownRef.current) {
      markerRef.current.style.cursor = null;
      setIsMouseDown(false);
      onChange(valuePendingRef.current);
    }
  }

  const percent = valuePendingRef.current
  return (
    <div className="slider">
      <div ref={ barRef } className="slider-bar" onClick={ onClick }>
        <div className="slider-bar-bg"></div>
        <div
          className="slider-bar-bg slider-bar-bg-active"
          style={{ width: `calc( ${ percent }%)` }}>
        </div>
      </div>
      <div
        ref={ markerRef }
        className="slider-marker"
        onMouseDown={ onMouseDown }
        style={{
          backgroundColor: isMouseDownRef.current && 'var(--accent-color-dark)',
          left: `calc(${ percent }% - var(--marker-size) / 2)`
        }}>
      </div>
    </div>
  );
}

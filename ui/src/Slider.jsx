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
    const barWidth = barRef.current.offsetWidth;
    const barX = barRef.current.getBoundingClientRect().left;
    const markerWidth = markerRef.current.offsetWidth;

    let percent = 100 * (event.clientX - barX - markerWidth / 2) / barWidth;
    percent = percent / getScalingFactor();
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
    const bar = barRef.current;
    const isMouseDown = isMouseDownRef.current;
    const mouse = mouseRef.current;

    if (isMouseDown) {
      const delta = event.clientX - mouse.event.clientX;

      let percent = 100 * (mouse.offset + delta) / bar.offsetWidth;
      percent = percent / getScalingFactor();
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

  function getScalingFactor() {
    const bar = barRef.current;
    const marker = markerRef.current;
    if (bar === null || marker === null) {
      return 0;
    }

    return (bar.offsetWidth - marker.offsetWidth) / bar.offsetWidth;
  }

  const percent = valuePendingRef.current * getScalingFactor();
  return (
    <div className="slider">
      <div ref={ barRef } className="slider-bar" onClick={ onClick }>
        <div className="slider-bar-bg"></div>
        <div
          className="slider-bar-bg slider-bar-bg-active"
          style={{ width: 'calc(' + percent + '%' + ' + var(--marker-size) / 2)' }}>
        </div>
      </div>
      <div
        ref={ markerRef }
        className="slider-marker"
        onMouseDown={ onMouseDown }
        style={{ left: percent + '%' }}>
      </div>
    </div>
  );
}

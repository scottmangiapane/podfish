import { useEffect, useRef, useState } from "react";

import "./Slider.css";

export default function Slider({ onChange, value }) {
  const barRef = useRef(null);
  const markerRef = useRef(null);

  const [_mouse, _setMouse] = useState({});
  const mouseRef = useRef(_mouse);
  function setMouse(data) {
    mouseRef.current = data;
    _setMouse(data);
  }

  const [_isMouseDown, _setIsMouseDown] = useState(false);
  const isMouseDownRef = useRef(_isMouseDown);
  function setIsMouseDown(data) {
    isMouseDownRef.current = data;
    _setIsMouseDown(data);
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  function onMouseDown(event) {
    markerRef.current.style.cursor = 'grabbing';
    setMouse({
      event,
      offsetLeft: markerRef.current.offsetLeft + markerRef.current.offsetWidth / 2
    });
    setIsMouseDown(true);
  }

  function onMouseMove(event) {
    const bar = barRef.current;
    const isMouseDown = isMouseDownRef.current;
    const mouse = mouseRef.current;

    if (isMouseDown) {
      let delta = event.clientX - mouse.event.clientX;
      delta = Math.max(delta, -mouse.offsetLeft);
      delta = Math.min(delta, bar.offsetWidth - mouse.offsetLeft);
      const percent = 100 * (mouse.offsetLeft + delta) / bar.offsetWidth;
      onChange(percent);
    }
  }

  function onMouseUp() {
    markerRef.current.style.cursor = null;
    setIsMouseDown(false);
  }

  return (
    <div className="slider">
      <div ref={ barRef } className="slider-bar">
        <div className="slider-bar-bg"></div>
        <div
          className="slider-bar-bg slider-bar-bg-active"
          style={{ width: value + '%' }}>
        </div>
      </div>
      <div
        ref={ markerRef }
        className="slider-marker"
        onMouseDown={ onMouseDown }
        style={{ left: 'max(0px, calc(' + value + '% - var(--marker-size) / 2))' }}>
      </div>
    </div>
  );
}

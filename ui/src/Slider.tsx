import { useEffect, useRef, useState } from "react";

import { useRootContext } from "@/contexts/RootContext";

import "@/Slider.css";

interface TSliderProps {
  labelEnd: string;
  labelStart: string;
  onChange?: (value: number) => void;
  onInput?: (value: number) => void;
  value: number;
}

export default function Slider({ labelEnd, labelStart, onChange, onInput, value }: TSliderProps) {
  const { state } = useRootContext();

  const barRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<HTMLDivElement | null>(null);

  // ref is used because state isn't updated inside of event listeners created by useEffect
  const mouseRef = useRef({});
  const isMouseDownRef = useRef(false);

  // ref is used because state isn't updated inside of event listeners created by useEffect
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const onInputRef = useRef(onInput);
  useEffect(() => {
    onInputRef.current = onInput;
  }, [onInput]);

  // ref is used because state isn't updated inside of event listeners created by useEffect
  // state is still needed to trigger re-renders
  const [_valuePending, _setValuePending] = useState(value);
  const valuePendingRef = useRef(_valuePending);
  function setValuePending(value: number) {
    valuePendingRef.current = value;
    _setValuePending(value);
  }

  useEffect(() => {
    if (!isMouseDownRef.current) {
      setValuePending(value);
    }
  }, [value]);

  useEffect(() => {
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('touchmove', onPointerMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onPointerMove);
      document.removeEventListener('touchmove', onPointerMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchend', onMouseUp);
    };
  }, []);

  function onPointerDown(event: React.MouseEvent | React.TouchEvent) {
    const marker = markerRef.current;
    if (!marker) return;
    marker.style.cursor = 'grabbing';

    mouseRef.current = { event, offset: marker.offsetLeft };
    isMouseDownRef.current = true;

    const percent = ('touches' in event)
      ? calculatePercent(event.touches?.[0]?.clientX)
      : calculatePercent(event.clientX);

    setValuePending(percent);
    onInputRef.current?.(percent);
  }

  function onPointerMove(event: MouseEvent | TouchEvent) {
    if (isMouseDownRef.current) {
      const percent = ('touches' in event)
        ? calculatePercent(event.touches?.[0]?.clientX)
        : calculatePercent(event.clientX);

      setValuePending(percent);

      onInputRef.current?.(percent);
    }
  }

  function onMouseUp() {
    const marker = markerRef.current;
    if (!marker) return;
    if (isMouseDownRef.current) {
      marker.style.cursor = '';
      isMouseDownRef.current = false;
      onChangeRef.current?.(valuePendingRef.current);
    }
  }

  function calculatePercent(mouseX: number) {
    const bar = barRef.current;
    if (!bar) return 0;
    const barWidth = bar.clientWidth;
    const barX = bar.getBoundingClientRect().left;
    let percent = 100 * (mouseX - barX) / barWidth;
    percent = Math.max(0, percent);
    percent = Math.min(100, percent);
    return percent;
  }

  const percent = valuePendingRef.current;
  const content = (
    <div
      className={ "slider " + ((state.isMobile) ? "slider-mobile" : "") }
      onMouseDown={ onPointerDown }
      onTouchStart={ onPointerDown }>
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
          backgroundColor: isMouseDownRef.current ? 'var(--accent-color-dark)' : undefined,
          left: `calc(${ percent }% - var(--marker-size) / 2)`
        }}>
      </div>
    </div>
  );

  if (state.isMobile) {
    return content;
  }

  return (
    <div className="labeled-slider">
      <p>{ labelStart }</p>
        { content }
      <p>{ labelEnd }</p>
    </div>
  );
}

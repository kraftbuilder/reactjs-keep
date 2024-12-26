import * as React from 'react';

export interface UseKeepOptions {
  /**
   * Optional condition function. If it returns false, dragging won't start.
   */
  condition?: (event: React.MouseEvent | MouseEvent) => boolean;

  /**
   * Triggered on mousedown (if condition is true).
   */
  onStart: (event: React.MouseEvent) => void;

  /**
   * Triggered on mousemove while the mouse is down.
   */
  onMove: (event: MouseEvent) => void;

  /**
   * Triggered on mouseup.
   */
  onStop: (event: MouseEvent) => void;
}

/**
 * useKeep
 * A custom hook to manage mouse interactions: mousedown, mousemove, mouseup.
 */
export default function useKeep({
  condition,
  onStart,
  onMove,
  onStop,
}: UseKeepOptions) {
  const isDownRef = React.useRef(false);

  const handleMouseDown = React.useCallback(
    (downEvent: React.MouseEvent) => {
      if (condition && !condition(downEvent)) return;

      isDownRef.current = true;
      onStart(downEvent);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (isDownRef.current) {
          onMove(moveEvent);
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        if (isDownRef.current) {
          isDownRef.current = false;
          onStop(upEvent);
        }

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [condition, onStart, onMove, onStop]
  );

  return handleMouseDown;
}
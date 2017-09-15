/* @flow */
// Copyright 2015-present Drifty Co.
// http://drifty.com/
// from: https://github.com/driftyco/ionic/blob/master/src/util/dom.ts
import * as React from 'react';

export function pointerCoord(
  event: SyntheticTouchEvent<HTMLDivElement>,
): { x: number, y: number } {
  // get coordinates for either a mouse click
  // or a touch depending on the given event
  if (event) {
    if (Array.isArray(event.changedTouches)) {
      const touches = event.changedTouches;
      if (Array.isArray(touches) && touches.length > 0) {
        const touch = touches[0];
        if (touch && touch.clientX && touch.clientY) {
          return { x: touch.clientX, y: touch.clientY };
        }
      }
    } else if (
      typeof event.pageX === 'number' &&
      typeof event.pageY === 'number'
    ) {
      return { x: event.pageX, y: event.pageY };
    }
  }
  return { x: 0, y: 0 };
}

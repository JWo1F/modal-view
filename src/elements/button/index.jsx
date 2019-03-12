import React from 'react';
import s from './style.styl';

export default function Button({ color, background, ...other }) {
  return <div
    className={s.button}
    style={{ background, color }}
    {...other}
  />;
}
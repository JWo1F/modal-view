import React from 'react';
import s from './button.styl';

export default function Button({ children, color, onClick, background }) {
  return <div onClick={onClick} className={s.button} style={{ background, color }}>{children}</div>;
}
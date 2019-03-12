import React from 'react';
import s from './style.styl';

export default function Input({ onChange, ...other }) {
  return <input
    className={s.input}
    onChange={e => onChange(e.target.value)}
    {...other}
  />;
}
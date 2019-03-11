import React from 'react';
import s from './input.styl';

export default function Input({ onChange, placeholder, value }) {
  return <input
    className={s.input}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    value={value}
  />;
}
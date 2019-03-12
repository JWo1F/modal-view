import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './modal.jsx';
import Button from './button.jsx';
import Input from './input.jsx';

export default function createModal({ render, confirm, cancel, confirmOnEnter=true, cancelOnEsc=true, title, descr, validator }) {
  return async function() {
    let result = {};
    let state = {};
    const div = document.createElement('div');

    const onChange = (hash) => {
      result = Object.assign({}, result, hash);
      update();
    };

    const onChangeState = (hash) => {
      state = Object.assign({}, state, hash);
      update();
    };

    const createButton = (style, fn) => <Button onClick={fn} {...defButton(style)} />;
    const createInput = (name, style) => <Input onChange={value => onChange({ [name]: value })} value={name in result ? result[name] : ''} {...defInput(style)} />;

    let onDone;
    let markup;
    let element = null;
    let ref;
    let res;
    let rej;

    const promise = new Promise((_res, _rej) => {
      res = _res;
      rej = _rej;
    });

    const enterHandler = e => confirmOnEnter && e.keyCode == 13 && onDone(true);
    const escHandler = e => cancelOnEsc && e.keyCode == 27 && onDone(false);
    
    onDone = async (isFail) => {
      if(validator) {
        const res = await validator({ state, result, onChangeState, onChange });
        if(res === false) return;
      }
      
      await ref.close();

      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      document.body.removeEventListener('keydown', enterHandler);
      document.body.removeEventListener('keydown', escHandler);

      res(isFail);
    };

    function update() {
      if(render) {
        element = render({
          result,
          onChange,
          state,
          onChangeState,
          onDone,
          createButton,
          createInput
        });
      }
  
      markup = (
        <Modal
          ref={node => ref = node}
          children={element}
          confirm={confirm}
          cancel={cancel}
          title={title}
          descr={descr}
          onCancel={() => onDone(false)}
          onConfirm={() => onDone(true)}
        />
      );

      ReactDOM.render(markup, div);
    }

    document.body.appendChild(div);
    document.body.addEventListener('keydown', enterHandler);
    document.body.addEventListener('keydown', escHandler);

    update();
    
    const isDone = await promise;
    
    return {
      result,
      isDone
    };
  };
}

function defButton(value) {
  if(typeof value == 'string') value = { text: value };
  if('text' in value) value = { ...value, children: value.text };
  return value;
}

function defInput(value) {
  if(!value) return {};
  return value;
}
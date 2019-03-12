import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './modal.jsx';
import Button from './elements/button/index.jsx';
import Input from './elements/input/index.jsx';

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
    const createInput = (name, style, afterChange) => {
      return <Input
        onChange={value => {
          onChange({ [name]: value });
          if(afterChange) afterChange();
        }}
        value={name in result ? result[name] : ''}
        {...defInput(style)}
      />
    };

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

    function onValidate() {
      return validator({ state, result, onChangeState, onChange });
    }
    
    onDone = async (isSuccess) => {
      if(isSuccess && validator) {
        const res = await onValidate();
        if(res === false) return;
      }
      
      await ref.close();

      ReactDOM.unmountComponentAtNode(div);
      document.body.removeChild(div);
      document.body.removeEventListener('keydown', enterHandler);
      document.body.removeEventListener('keydown', escHandler);

      res(isSuccess);
    };

    function update() {
      if(render) {
        element = render({
          result,
          onChange,
          state,
          onChangeState,
          onDone,
          onValidate,
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
import React from 'react';
import ReactDOM from 'react-dom';
import createModal from '../src/fabric.jsx';
import './index.styl';
import s from './style.styl';

import { alert, confirm } from '../src/defaults.jsx';

const showModal1 = createModal({
  confirm: 'Да',
  cancel: true,
  title: 'Создание группы',
  validator: ({ onChangeState, result }) => {
    if(!result.value) {
      onChangeState({ error: 'Название не может быть пустым!' });
      return false;
    }
    if(result.value[0] != '-') {
      onChangeState({ error: 'Название должно начинаться с "-"!' });
      return false;
    }
    if(result.value.length < 5) {
      onChangeState({ error: 'Название должно быть не менее 5 символов!' });
      return false;
    }
    onChangeState({ error: false });
  },
  render: ({ state, createInput, createButton, onValidate }) => {
    return <div>
      <div className={s.inputHolder}>
        <div className={s.inputWrapper}>{createInput('value', { placeholder: 'Введите название группы', autoFocus: true })}</div>
        <div className={s.buttonWrapper}>{createButton('Проверить', onValidate)}</div>
      </div>
      {!!state.error && <div className={s.error}>Произошла ошибка: {state.error}</div>}
    </div>;
  }
});

async function inspect(promise) {
  console.log('Modal show');
  const result = await promise;
  console.log('Modal hide:', result);
}

class Element extends React.Component {
  render() {
    return <div>
      <div>Нормальная <Button name="фабрика" onClick={showModal1} /></div>
      <div>Простой <Button name="конфирм" onClick={() => confirm('Подтвердите действие', 'Вы действительно хотите удалить элемент без возможности восстановления?', 'Да', 'Нет')} /></div>
      <div>Простой <Button name="алерт" onClick={() => alert('Опрос удалён', 'Опрос был успешно удалён', 'Закрыть')} /></div>
    </div>
  }
}

function Button({ name, onClick }) {
  return <span className={s.link} onClick={() => inspect(onClick())}>{name}</span>;
}

ReactDOM.render(<Element />, document.querySelector('#app'));
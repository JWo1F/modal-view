import React from 'react';
import ReactDOM from 'react-dom';
import createModal from '../src/fabric.jsx';
import './index.styl';

import { alert, confirm } from '../src/defaults.jsx';

const showModal1 = createModal({
  confirm: 'Да',
  cancel: true,
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
      <div style={{ fontWeight: 'bold', fontSize: '130%', marginBottom:'15px' }}>Создание группы</div>
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>{createInput('value', { placeholder: 'Введите название группы', autoFocus: true })}</div>
        <div style={{ flexShrink: 0, marginLeft: '10px' }}>{createButton('Проверить', onValidate)}</div>
      </div>
      {!!state.error && <div style={{ background: '#d03232', color: '#fff', padding: '5px 10px', borderRadius: '3px', margin: '5px 0', fontWeight: 'bold' }}>Произошла ошибка: {state.error}</div>}
    </div>;
  }
});

async function inspect(promise) {
  console.log('Modal show');
  const result = await promise;
  console.log('Modal hide', result);
}

class Element extends React.Component {
  render() {
    return <div>
      <div>Нормальная <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => inspect(showModal1())}>фабрика</span></div>
      <div>Простой <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => inspect(confirm('Подтвердите действие', 'Вы действительно хотите удалить элемент без возможности восстановления?', 'Да', 'Нет'))}>конфирм</span></div>
      <div>Простой <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => inspect(alert('Опрос удалён', 'Опрос был успешно удалён', 'Закрыть'))}>алерт</span></div>
    </div>
  }
}

ReactDOM.render(<Element />, document.querySelector('#app'));
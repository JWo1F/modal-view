import React from 'react';
import ReactDOM from 'react-dom';
import s from './style.styl';
import createModal from './fabric.jsx';
import './index.styl';

import { alert, confirm } from './defaults.jsx';

const showModal1 = createModal({
  confirm: 'Да',
  cancel: true,
  confirmOnEnter: false,
  render: ({ onChange, onChangeState, onDone, state, createInput, createButton }) => {
    return <div>
      <div style={{ fontWeight: 'bold', fontSize: '130%', marginBottom:'15px' }}>Создание группы</div>
      <div style={{ display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>{createInput('value', { placeholder: 'Введите название группы', onChange: val => { onChangeState({ error: 0 }); onChange({ value: val }); } })}</div>
        <div style={{ flexShrink: 0, marginLeft: '10px' }}>{createButton('Проверить', () => onChangeState({ error: 1 }))}</div>
      </div>
      {!!state.error && <div style={{ color: 'red' }}>Кажется, тут ошибочка!</div>}
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
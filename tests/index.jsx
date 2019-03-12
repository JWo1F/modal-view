import React from 'react';
import ReactDOM from 'react-dom';
import { createModal } from '../src/fabric.jsx';
import './index.styl';
import s from './style.styl';
import { default as ButtonCore } from '../src/elements/button/index.jsx';

import { alert, confirm, prompt } from '../src/defaults.jsx';

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
      <Button
        name="Нормальная фабрика"
        onClick={showModal1}
      />
      <Button
        name="Простой конфирм"
        onClick={() => {
          return confirm({
            title: 'Подтвердите действие',
            descr: 'Вы действительно хотите удалить элемент без возможности восстановления?',
            confirm: 'Да',
            cancel: 'Нет'
          });
        }}
        />
      <Button
        name="Простой алерт"
        onClick={() => {
          return alert({
            title: 'Опрос удалён',
            descr: 'Опрос был успешно удалён',
            confirm: 'Закрыть'
          });
        }}
      />
      <Button
        name="Простой prompt"
        onClick={() => {
          return prompt({
            title: 'Введите название',
            descr: 'И тогда мы сможем создать эту сущность',
            placeholder: 'Название',
            confirm: 'Создать'
          });
        }}
      />
      <Button
        name="Успешный алерт"
        onClick={() => {
          return alert({
            title: 'Опрос удалён',
            descr: 'Опрос был успешно удалён',
            confirm: 'Закрыть',
            type: 'success'
          });
        }}
      />
      <Button
        name="Ошибочный алерт"
        onClick={() => {
          return alert({
            title: 'Ошибка',
            descr: 'К сожалению, этот опрос невозможно удалить',
            confirm: 'Закрыть',
            type: 'error'
          });
        }}
      />
      <Button
        name="Информационный алерт"
        onClick={() => {
          return alert({
            title: 'Информация',
            descr: 'Этот пункт меню будет доступен в скором времени',
            confirm: 'Закрыть',
            type: 'info'
          });
        }}
      />
      <Button
        name="Предупреждающий алерт"
        onClick={() => {
          return alert({
            title: 'Внимание',
            descr: 'Вы удалили этот пункт меню. В будущем он будет недоступен.',
            confirm: 'Закрыть',
            type: 'warning'
          });
        }}
      />
    </div>
  }
}

function Button({ name, onClick }) {
  return <div className={s.buttonWrapper}><ButtonCore onClick={() => inspect(onClick())}>{name}</ButtonCore></div>;
}

ReactDOM.render(<Element />, document.querySelector('#app'));
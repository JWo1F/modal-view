import React from 'react';
import s from './modal.styl';
import cx from 'classnames';
import Button from './button.jsx';

export default class Modal extends React.Component {
  state = {
    visible: false,
    hidding: false,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ visible: true });
    });
  }

  async close() {
    this.setState({ visible: false, hidding: true });
    await new Promise(res => setTimeout(res, 200));
  }

  backClick(e) {
    if(e.target.hasAttribute('data-back')) {
      this.props.onCancel();
    }
  }

  render() {
    const c = cx(s.back, {
      [s.visible]: this.state.visible,
      [s.hidding]: this.state.hidding,
    });

    let confirm = this.props.confirm;
    let cancel = this.props.cancel;

    if(confirm === true) confirm = { text: 'Подтвердить', background: '#3085d6', color: '#fff' };
    if(cancel === true) cancel = { text: 'Отмена' };
    if(typeof confirm == 'string') confirm = { text: confirm, background: '#3085d6', color: '#fff' };
    if(typeof cancel == 'string') cancel = { text: cancel };

    return <div className={c} onClick={this.backClick.bind(this)} data-back>
      <div className={s.container}>
        {this.props.title && <div style={{ fontWeight: 'bold', fontSize: '130%', marginBottom:'15px' }}>{this.props.title}</div>}
        {this.props.descr && <div>{this.props.descr}</div>}
        <div className={s.wrapper}>{this.props.children}</div>
        {!!(cancel || confirm) && <div className={s.buttons}>
          {!!cancel && <Button onClick={this.props.onCancel} background={cancel.background} color={cancel.color}>{cancel.text}</Button>}
          {!!confirm && <Button onClick={this.props.onConfirm} background={confirm.background} color={confirm.color}>{confirm.text}</Button>}
        </div>}
      </div>
    </div>;
  }
}
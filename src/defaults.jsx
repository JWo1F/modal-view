import { showModal } from './fabric.jsx';

export const alert = async (title, descr, confirmText) => {
  await showModal({
    confirm: confirmText || true,
    title,
    descr
  });

  return true;
};

export const confirm = async (title, descr, confirmText, cancelText) => {
  const { isDone } = await showModal({
    confirm: confirmText || true,
    cancel: cancelText || true,
    title,
    descr
  });

  return isDone;
};

export const prompt = async (title, descr, placeholder, confirmText, cancelText) => {
  const result = await showModal({
    title,
    descr,
    confirm: confirmText,
    cancel: cancelText,
    render: ({ createInput }) => {
      return createInput('value', { placeholder: placeholder, autoFocus: true });
    }
  });

  if(!result.isDone) return false;
  return result.result.value;
};
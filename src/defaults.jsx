import { showModal } from './fabric.jsx';

export const alert = async ({ title, descr, confirm, type }) => {
  await showModal({
    confirm: confirm || true,
    title,
    descr,
    type
  });

  return true;
};

export const confirm = async ({ title, descr, confirm, cancel, type }) => {
  const { isDone } = await showModal({
    confirm: confirm || true,
    cancel: cancel || true,
    title,
    descr,
    type
  });

  return isDone;
};

export const prompt = async ({ title, descr, placeholder, confirm, cancel, type }) => {
  const result = await showModal({
    title,
    descr,
    type,
    confirm: confirm || true,
    cancel: cancel || true,
    render: ({ createInput }) => {
      return createInput('value', { placeholder: placeholder, autoFocus: true });
    }
  });

  if(!result.isDone) return false;
  return result.result.value;
};
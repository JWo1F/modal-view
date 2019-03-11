import createModal from './fabric.jsx';

export const alert = async (title, descr, confirmText) => {
  const modal = createModal({
    confirm: confirmText || true,
    title,
    descr
  });

  await modal();

  return true;
};

export const confirm = async (title, descr, confirmText, cancelText) => {
  const modal = createModal({
    confirm: confirmText || true,
    cancel: cancelText || true,
    title,
    descr
  });

  const { isDone } = await modal();

  return isDone;
};
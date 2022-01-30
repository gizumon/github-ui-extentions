export const disabledClassName = 'extensions-disabled'

export const hasElementAdded = (className: string): boolean => {
  const els = document.getElementsByClassName(className);
  return els && els.length > 0;
}

export const disabledElementsByClassName = (className: string): void => {
  const targetEls = document.querySelectorAll(className);
  targetEls.forEach((el) => el.classList.add(disabledClassName));
}

export const enabledElementsByClassName = (className: string): void => {
  const targetEls = document.querySelectorAll(className);
  targetEls.forEach((el) => el.classList.remove(disabledClassName));
}
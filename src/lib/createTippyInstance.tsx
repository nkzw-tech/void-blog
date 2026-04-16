import _tippy, { Tippy } from 'tippy.js';

const tippy = _tippy as unknown as Tippy;

export default function createTippyInstance(
  element: HTMLElement,
  content: string | HTMLElement,
) {
  return tippy(element, {
    animation: 'perspective-subtle',
    appendTo: document.body,
    content,
    delay: 100,
    interactive: true,
    interactiveBorder: 10,
    theme: 'light-border',
  });
}

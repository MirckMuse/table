import type { ObjectDirective } from "vue";

enum ResizeType {
  Width = "width",
  Height = "height",
}

interface Rect {
  width: number;
  height: number;
  offsetWidth: number;
  offsetHeight: number;
}

//  把 observer 挂载在 dom 上的 key
const Mount_ResizeObserver_Key = "__resize_observer_key__";
const Mount_Rect_Key = "__resize_rect_key__";

function createResizeObserverCallback(type: ResizeType) {
  return function (entries: ResizeObserverEntry[]) {
    const { target } = entries[0];

    const { width, height } = target.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = target as HTMLElement;

    update(
      target,
      type,
      { width, height, offsetWidth, offsetHeight },
      (target as any)?.[Mount_Rect_Key] || {}
    );
  }
}

function destoryObserver(el: any) {
  const observer = el[Mount_ResizeObserver_Key];
  if (!observer) return;

  observer.unobserve(el);
  observer.disconnect();
  el[Mount_ResizeObserver_Key] = null;
}

function update(el: Element, type: ResizeType, newRect: Rect, oldRect: Rect) {
  // TODO:
  (el as any)[Mount_Rect_Key] = {}
}

function createResizeObserver(el: any, type: ResizeType) {
  const observe = new ResizeObserver(createResizeObserverCallback(type))
  observe.observe(el);
  el[Mount_ResizeObserver_Key] = observe;
}

export const resize: ObjectDirective = {
  created(el, binding) {
    const { arg, value = true } = binding;
    if (!value) return;

    createResizeObserver(el, arg as ResizeType);
  },
  updated(el, binding) {
    const { arg, value = true } = binding;
    if (value && !el[Mount_ResizeObserver_Key]) {
      createResizeObserver(el, arg as ResizeType);
    } else if (!value) {
      destoryObserver(el);
    }
  },
  beforeUnmount(el, binding) {
    const { arg, value = true } = binding;

    if (value) {
      update(el, arg as ResizeType, {
        width: 0,
        height: 0,
        offsetHeight: 0,
        offsetWidth: 0
      }, el[Mount_Rect_Key] || {});
    }

    destoryObserver(el);
  }
};

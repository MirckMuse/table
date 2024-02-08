export interface AddEventListenerHandle {
  remove: () => void;
}

export function addEventListener(
  target: HTMLElement,
  eventType: keyof HTMLElementEventMap,
  cb: any,
  option?: boolean | AddEventListenerOptions
) {
  target.addEventListener?.(eventType, cb, option)

  return {
    remove() {
      target.removeEventListener?.(eventType, cb)
    }
  }
};

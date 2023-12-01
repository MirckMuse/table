export function createLockedRequestAnimationFrame(callback: (...args: any) => void,): (...args: any) => void {
  let locked = false;

  return (...args: any) => {
    if (locked) return;

    locked = true;
    window.requestAnimationFrame(() => {
      callback(...args);
      locked = false;
    });
  }
}

/**
 * 创建一个锁定的动画帧请求函数
 * 
 * @param callback - 回调函数，将在下一帧上调用
 * @returns 锁定的动画帧请求函数
 */
export function createLockedRequestAnimationFrame(callback: (...args: any) => void): (...args: any) => void {
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
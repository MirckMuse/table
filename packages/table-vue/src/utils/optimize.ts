export const optimizeScrollXY = (
  x: number,
  y: number,
  ratio: number = 1,
): [number, number] => {
  // 调参工程师
  const ANGLE = 2;
  const angle = Math.abs(x / y);

  // 经过滚动优化之后的 x, y
  const deltaX = angle <= 1 / ANGLE ? 0 : x;
  const deltaY = angle > ANGLE ? 0 : y;

  return [deltaX * ratio, deltaY * ratio];
};
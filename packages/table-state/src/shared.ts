export function adjustScrollOffset(offset: number, maxMove: number) {
  return Math.max(0, Math.min(maxMove, offset))
}

export function rowKeyCompare(prev: string, next: string) {
  const prevIndex = prev.split("-").map(char => Number(char));
  const nextIndex = next.split("-").map(char => Number(char));
  const maxLength = Math.max(prevIndex.length, nextIndex.length);

  let _compare = 0;
  for (let i = 0; i < maxLength; i++) {
    const prev = prevIndex[i] || -1;
    const next = nextIndex[i] || -1;

    _compare = prev - next;

    if (_compare !== 0) {
      return _compare
    }
  }

  return _compare;
}


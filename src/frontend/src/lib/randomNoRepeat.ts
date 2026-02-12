export function randomNoRepeat<T>(items: T[]): () => T {
  let lastIndex = -1;

  return () => {
    if (items.length === 0) {
      throw new Error('Cannot select from empty array');
    }

    if (items.length === 1) {
      return items[0];
    }

    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * items.length);
    } while (newIndex === lastIndex);

    lastIndex = newIndex;
    return items[newIndex];
  };
}

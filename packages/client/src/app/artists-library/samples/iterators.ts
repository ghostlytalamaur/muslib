function range(start: number, count: number): Iterable<number> {
  class RangeIterator implements Iterator<number> {
    private readonly last: number;

    constructor(private current: number, private total: number) {
      this.last = current + total;
    }

    next(): IteratorResult<number> {
      if (this.current < this.last) {
        return { done: false, value: this.current++ };
      } else {
        return { done: true, value: undefined };
      }
    }
  }

  return {
    [Symbol.iterator](): Iterator<number> {
      return new RangeIterator(start, count);
    }
  };
}

function* rangeGenerator(
  start: number,
  count: number
): IterableIterator<number> {
  for (let i = start; i < start + count; i++) {
    yield i;
  }
}

function testGenerator(): void {
  for (const i of rangeGenerator(0, 5)) {
    console.log('Range generator:', i);
  }

  const r = rangeGenerator(0, 2);
  console.log(...r);
  console.log(r.next());
  console.log(r.next());
  console.log(r.next());
}

export function testIterator(): void {
  console.log('testIterator');
  const r = range(0, 10);
  for (const i of r) {
    console.log('Iterator1 value:', i);
  }

  for (const i of r) {
    console.log('Iterator2 value:', i);
  }

  testGenerator();
}

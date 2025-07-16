export class Paginated<T extends { toPrimitives: () => ReturnType<T['toPrimitives']> }> {
  constructor(
    private readonly elements: T[],
    private readonly offset: number,
    private readonly numberOfItems: number,
    private readonly total: number,
  ) {}

  getElements(): T[] {
    return this.elements;
  }

  toPrimitives(): {
    elements: ReturnType<T['toPrimitives']>[];
    offset: number;
    numberOfItems: number;
    total: number;
  } {
    return {
      elements: this.elements.map((el) => el.toPrimitives()),
      offset: this.offset,
      numberOfItems: this.numberOfItems,
      total: this.total,
    };
  }
}

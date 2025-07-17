export class Paginated<T extends { toPrimitives: () => ReturnType<T['toPrimitives']> }> {
  constructor(
    private readonly elements: T[],
    private readonly page: number,
    private readonly pageSize: number,
    private readonly total: number,
  ) {}

  getElements(): T[] {
    return this.elements;
  }

  toPrimitives(): {
    elements: ReturnType<T['toPrimitives']>[];
    page: number;
    pageSize: number;
    total: number;
  } {
    return {
      elements: this.elements.map((el) => el.toPrimitives()),
      page: this.page,
      pageSize: this.pageSize,
      total: this.total,
    };
  }
}

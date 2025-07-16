export abstract class SingleValueObject<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  getValue(): T {
    return this.value;
  }

  equals(SingleValueObject: SingleValueObject<T>): boolean {
    return this.value === SingleValueObject.value;
  }
}

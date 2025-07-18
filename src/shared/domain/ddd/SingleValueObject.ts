export abstract class SingleValueObject<T> {
  private readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.validate();
  }

  valueOf(): T {
    return this.value;
  }

  equals(SingleValueObject: SingleValueObject<T>): boolean {
    return this.value === SingleValueObject.value;
  }

  abstract validate(): boolean; // You can implement logic for boolean validation or throw an error
}

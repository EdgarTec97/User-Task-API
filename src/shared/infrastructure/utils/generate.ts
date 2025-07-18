import { v4 } from 'uuid';
import { startOfDay, endOfDay } from 'date-fns';

export class GeneralUtils {
  static uuid(): string {
    return v4();
  }

  static currentDate(): string {
    return new Date().toISOString();
  }

  /**
   * Removes a set of keys from an object and returns a new object
   * that is fully type‑safe (the resulting type is `Omit<T, K[number]>`).
   *
   * @param obj   Source object (will not be mutated).
   * @param keys  Array (or tuple) of property names to omit.
   *
   * @returns A new object without the specified keys.
   */
  static omit<T extends Record<string, unknown>, const K extends readonly (keyof T)[]>(
    obj: T,
    keys: K,
  ): Omit<T, K[number]> {
    // Build a Set for O(1) lookups
    const toDelete = new Set<keyof T>(keys);

    // Create a new object via entry filtering
    return Object.fromEntries(Object.entries(obj).filter(([prop]) => !toDelete.has(prop as keyof T))) as Omit<
      T,
      K[number]
    >;
  }

  static toISO(d: Date): string {
    return d.toISOString();
  }

  static startDay(d: string): string {
    return this.toISO(startOfDay(new Date(d)));
  }

  static endDay(d: string): string {
    return this.toISO(endOfDay(new Date(d)));
  }
}

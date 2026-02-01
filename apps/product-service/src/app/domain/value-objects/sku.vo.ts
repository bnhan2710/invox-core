export class SKU {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value: string): SKU {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }

    if (value.length > 100) {
      throw new Error('SKU cannot exceed 100 characters');
    }

    const skuPattern = /^[A-Z0-9-]+$/;
    if (!skuPattern.test(value)) {
      throw new Error('SKU must contain only uppercase letters, numbers, and hyphens');
    }

    return new SKU(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SKU): boolean {
    return this.value === other.value;
  }
}

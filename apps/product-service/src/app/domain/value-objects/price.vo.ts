export class Price {
  private readonly amount: number;
  private readonly currency: string;

  private constructor(amount: number, currency = 'VND') {
    this.amount = amount;
    this.currency = currency;
  }

  static create(amount: number, currency = 'VND'): Price {
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }

    if (!Number.isFinite(amount)) {
      throw new Error('Price must be a valid number');
    }

    return new Price(amount, currency);
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  calculateWithVAT(vatRate: number): number {
    return this.amount * (1 + vatRate);
  }

  multiply(quantity: number): Price {
    return new Price(this.amount * quantity, this.currency);
  }
}

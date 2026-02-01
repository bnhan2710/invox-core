export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProductNotFoundException extends DomainException {
  constructor(identifier: string) {
    super(`Product not found: ${identifier}`);
  }
}

export class ProductAlreadyExistsException extends DomainException {
  constructor(sku: string) {
    super(`Product with SKU ${sku} already exists`);
  }
}

export class InvalidProductDataException extends DomainException {
  constructor(reason: string) {
    super(`Invalid product data: ${reason}`);
  }
}

export class ProductPriceException extends DomainException {
  constructor(reason: string) {
    super(`Product price error: ${reason}`);
  }
}

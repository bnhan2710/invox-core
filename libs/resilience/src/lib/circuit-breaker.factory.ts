import CircuitBreaker from 'opossum';
import { Logger } from '@nestjs/common';

export interface CircuitBreakerOptions {
  timeout?: number; // ms
  errorThresholdPercentage?: number; // % errors to open circuit
  resetTimeout?: number; // ms
  rollingCountTimeout?: number;
  volumeThreshold?: number; // min requests before calculating error rate
  fallback?: (error: Error) => any;
}

export class CircuitBreakerFactory {
  private static logger = new Logger('CircuitBreaker');

  static create<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    name: string,
    options: CircuitBreakerOptions = {},
  ): CircuitBreaker<Parameters<T>, ReturnType<T>> {
    const defaults: CircuitBreakerOptions = {
      timeout: 3000,
      errorThresholdPercentage: 50,
      resetTimeout: 30000,
      rollingCountTimeout: 10000,
      volumeThreshold: 5,
    };

    const breaker = new CircuitBreaker<Parameters<T>, ReturnType<T>>(fn, {
      ...defaults,
      ...options,
    });

    // Events monitoring
    breaker.on('open', () => {
      this.logger.warn(`Circuit breaker [${name}] OPENED - Too many failures`);
    });

    breaker.on('halfOpen', () => {
      this.logger.log(`Circuit breaker [${name}] HALF-OPEN - Testing...`);
    });

    breaker.on('close', () => {
      this.logger.log(`Circuit breaker [${name}] CLOSED - Service recovered`);
    });

    breaker.on('fallback', (result) => {
      this.logger.warn(`Circuit breaker [${name}] FALLBACK executed`);
    });

    if (options.fallback) {
      breaker.fallback(options.fallback);
    }

    return breaker;
  }
}

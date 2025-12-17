export interface SagaStep {
  name: string;
  action: () => Promise<any>;
  compensate: () => Promise<any>;
}

export enum SAGA_STEP_STATUS {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
  FAILED = 'FAILED',
}

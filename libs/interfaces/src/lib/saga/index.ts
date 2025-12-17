export interface SagaStep {
  name: string;
  action: () => Promise<any>;
  compensate: () => Promise<any>;
}

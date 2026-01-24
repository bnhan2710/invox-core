import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { SAGA_STATUS, SAGA_TYPES, SAGA_STEP_STATUS } from '@common/constants/enum/saga/saga.enum';
import { Model } from 'mongoose';

export class SagaStepData {
  @Prop({ type: String, required: true })
  stepName: string;

  @Prop({ type: String, enum: SAGA_STEP_STATUS, default: SAGA_STEP_STATUS.PENDING })
  status: SAGA_STEP_STATUS;

  @Prop({ type: Date })
  startedAt?: Date;

  @Prop({ type: Date })
  completedAt?: Date;

  @Prop({ type: String })
  error?: string;

  @Prop({ type: Object })
  data?: any;
}

@Schema({
  collection: 'saga_instances',
})
export class SagaInstance extends BaseSchema {
  @Prop({ type: String, required: true, enum: SAGA_TYPES })
  sagaType: SAGA_TYPES;

  @Prop({ type: String, enum: SAGA_STATUS, default: SAGA_STATUS.PENDING })
  status: SAGA_STATUS;

  @Prop({ type: Number, required: true, default: 0 })
  currentStep: number;

  @Prop({ type: [SagaStepData], default: [] })
  steps: SagaStepData[];

  @Prop({ type: Object, required: true })
  context: Record<string, any>;

  @Prop({ type: String })
  error?: string;
}

export const SagaInstanceSchema = createSchema(SagaInstance);

export const SagaInstanceModelName = SagaInstance.name;
export const SagaInstanceDestination = {
  name: SagaInstanceModelName,
  schema: SagaInstanceSchema,
};

export type SagaInstanceModel = Model<SagaInstance>;

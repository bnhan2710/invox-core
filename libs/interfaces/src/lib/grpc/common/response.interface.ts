import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { HttpStatus } from '@nestjs/common';

export class Response<T> {
  code: string;
  data?: T;
  error?: '';
  statusCode: number;

  constructor(data: Partial<Response<T>>) {
    this.code = data.code || HTTP_MESSAGE.OK;
    this.data = data.data;
    this.error = data.error || '';
    this.statusCode = data.statusCode || HttpStatus.OK;
  }

  static success<T>(data: T): Response<T> {
    return new Response<T>({ data });
  }
}

export type ResponseType<T> = Response<T>;

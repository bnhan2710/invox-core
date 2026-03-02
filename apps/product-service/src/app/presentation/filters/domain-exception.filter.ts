import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import {
  DomainException,
  ProductNotFoundException,
  ProductAlreadyExistsException,
  InvalidProductDataException,
} from '../../domain/exceptions';

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const ctx = host.switchToRpc();
    const data = ctx.getData();

    // map domain exceptions to appropriate error codes
    const errorMap = {
      [ProductNotFoundException.name]: { code: 'PRODUCT_NOT_FOUND', status: HttpStatus.NOT_FOUND },
      [ProductAlreadyExistsException.name]: { code: 'PRODUCT_ALREADY_EXISTS', status: HttpStatus.CONFLICT },
      [InvalidProductDataException.name]: { code: 'INVALID_PRODUCT_DATA', status: HttpStatus.BAD_REQUEST },
    };

    const error = errorMap[exception.constructor.name] || {
      code: 'INTERNAL_ERROR',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    };

    throw new RpcException({
      code: error.code,
      message: exception.message,
      statusCode: error.status,
      timestamp: new Date().toISOString(),
      processId: data?.processId,
    });
  }
}

import { Controller, Inject, UseInterceptors, UseFilters } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { PRODUCT_USECASE } from '../product.di-tokens';
import { ProductUseCase } from '../domain/ports/product.port';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { DomainExceptionFilter } from './filters/domain-exception.filter';
import { CreateProductInput } from '../application/dtos/create-product.input';
import { ProductTcpMapper } from './product-tcp.mapper';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
@UseFilters(DomainExceptionFilter)
export class ProductTcpController {
  constructor(@Inject(PRODUCT_USECASE) private readonly useCase: ProductUseCase) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(@RequestParams() dto: CreateProductTcpRequest): Promise<Response<ProductTcpResponse>> {
    const input: CreateProductInput = {
      name: dto.name,
      description: dto.description,
      sku: dto.sku,
      unit: dto.unit,
      price: dto.price,
      vatRate: dto.vatRate,
    };
    const result = await this.useCase.create(input);

    return Response.success<ProductTcpResponse>(ProductTcpMapper.toResponse(result));
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST)
  async getList(): Promise<Response<ProductTcpResponse[]>> {
    const result = await this.useCase.getList();
    return Response.success<ProductTcpResponse[]>(result.map(ProductTcpMapper.toResponse));
  }
}

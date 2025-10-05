import { Controller, Inject, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { PRODUCT_SERVICE } from '../product.di-tokens';
import { IProductService } from '../application/ports/product.port';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateProductTcpRequest, ProductTcpResponse } from '@common/interfaces/tcp/product';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class ProductTcpController {
  constructor(@Inject(PRODUCT_SERVICE) private readonly productService: IProductService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.CREATE)
  async create(@RequestParams() body: CreateProductTcpRequest): Promise<Response<ProductTcpResponse>> {
    const result = await this.productService.create(body);
    return Response.success<ProductTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.PRODUCT.GET_LIST)
  async getList(): Promise<Response<ProductTcpResponse[]>> {
    const result = await this.productService.getList();
    return Response.success<ProductTcpResponse[]>(result);
  }
}

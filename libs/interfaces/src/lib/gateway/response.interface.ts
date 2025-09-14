import { HttpStatus } from '@nestjs/common';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty({ type: String })
  message: string = HTTP_MESSAGE.OK;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  processID?: string;

  @ApiProperty({ type: Number })
  statusCode = HttpStatus.OK;

  @ApiProperty()
  duration?: string;

  constructor(partial: Partial<ResponseDto<T>>) {
    Object.assign(this, partial);
  }
}

import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ example: 'access-token', description: 'Access token for the user' })
  accessToken: string;

  @ApiProperty({ example: 'refresh-token', description: 'Refresh token for the user' })
  refreshToken: string;
}

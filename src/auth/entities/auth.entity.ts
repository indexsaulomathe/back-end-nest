import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty({ description: 'Access token for authenticated user.' })
  accessToken: string;
}

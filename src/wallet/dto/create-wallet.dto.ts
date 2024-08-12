import { IsNotEmpty, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({
    description: 'User ID associated with the wallet',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsInt({ message: 'User ID must be an integer' })
  userId: number;

  @ApiProperty({
    description: 'Initial balance of the wallet',
    example: 100.0,
    required: true,
  })
  @IsNumber({}, { message: 'Balance must be a number' })
  balance: number;
}

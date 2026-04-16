import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class BaseCredentialsDto {
  @ApiProperty({ example: 'user@mail.com' })
  @IsEmail()
  email: string

  @ApiProperty({ example: '123456', minLength: 6, maxLength: 14 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(14)
  password: string
}

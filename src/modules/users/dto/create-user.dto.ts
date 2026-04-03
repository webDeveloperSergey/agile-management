import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(14)
  password: string
}

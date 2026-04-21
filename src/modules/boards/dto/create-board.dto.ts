import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator'

export class CreateBoardDto {
  @IsNotEmpty()
  @Length(3, 20)
  name: string

  @IsOptional()
  @Length(5, 100)
  description?: string

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  memberships?: string[]
}

import { Length } from 'class-validator'

export class CreateColumnDto {
  @Length(1, 225)
  name!: string
}

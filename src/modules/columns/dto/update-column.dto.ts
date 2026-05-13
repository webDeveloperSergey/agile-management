import { PickType } from '@nestjs/mapped-types'
import { CreateColumnDto } from './create-column.dto'

export class UpdateColumnDto extends PickType(CreateColumnDto, [
  'name',
] as const) {}

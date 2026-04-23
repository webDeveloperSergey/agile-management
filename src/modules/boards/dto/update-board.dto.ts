import { PartialType, PickType } from '@nestjs/mapped-types'
import { CreateBoardDto } from './create-board.dto'

export class UpdateBoardDto extends PartialType(
  PickType(CreateBoardDto, ['name', 'description'] as const),
) {}

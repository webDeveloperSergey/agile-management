import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getOneUser(id)
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll() {
    return this.usersService.getAllUsers()
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }
}

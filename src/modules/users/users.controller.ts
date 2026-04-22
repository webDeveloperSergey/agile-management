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
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { UserRole } from 'prisma/generated/prisma/client'
import { USER_SELECT } from 'src/shared/constants/users-select.constants'
import { Roles } from 'src/shared/decorators/roles.decorator'
import { JwtGuard } from 'src/shared/guards/jwt.guard'
import { RoleGuard } from 'src/shared/guards/roles.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get one user by id param' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.getOneUser(id)
  }

  @ApiOperation({ summary: 'Get many users' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.usersService.getAllUsers()
  }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description:
      'Returns new user object with fields: user_id, email, created_at',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto, USER_SELECT)
  }
}

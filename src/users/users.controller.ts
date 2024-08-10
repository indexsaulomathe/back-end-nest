import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-config/jwt-auth.guard';
import { CreateUserService } from './create-user/create-user.service';
import { FindOneUserService } from './find-one-user/find-one-user.service';
import { FindAllUserService } from './find-all-user/find-all-user.service';
import { UpdateUserService } from './update-user/update-user.service';
import { DeleteUserService } from './delete-user/delete-user.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findOneUserService: FindOneUserService,
    private readonly findAllUserService: FindAllUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiOkResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.createUserService.create(createUserDto);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(): Promise<UserEntity[]> {
    return await this.findAllUserService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.findOneUserService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.updateUserService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: number): Promise<UserEntity> {
    return await this.deleteUserService.remove(id);
  }
}

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
  Request,
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
import { JwtAuthGuard } from '../auth/jwt-config/jwt-auth.guard';
import { Roles } from '../auth/roles-guard/roles.decorator';
import { RolesGuard } from '../auth/roles-guard/roles.guard';
import { CreateUserService } from './create-user/create-user.service';
import { FindOneUserService } from './find-one-user/find-one-user.service';
import { FindAllUserService } from './find-all-user/find-all-user.service';
import { UpdateUserService } from './update-user/update-user.service';
import { DeleteUserService } from './delete-user/delete-user.service';

@Controller('users')
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly findOneUserService: FindOneUserService,
    private readonly findAllUserService: FindAllUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly deleteUserService: DeleteUserService,
  ) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create user' })
  @ApiOkResponse({ type: UserEntity })
  async create(
    @Body() createUserDto: CreateUserDto,
    @Request() req,
  ): Promise<UserEntity> {
    const authUser = req.user.email;
    return this.createUserService.create(createUserDto, authUser);
  }

  @Get()
  @Roles('admin')
  @ApiOkResponse({ type: UserEntity, isArray: true })
  async findAll(): Promise<UserEntity[]> {
    return await this.findAllUserService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'user')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.findOneUserService.findOne(id);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiOkResponse({ type: UserEntity })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ): Promise<UserEntity> {
    const authUser = req.user.email;
    return this.updateUserService.update(id, updateUserDto, authUser);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOkResponse({ type: UserEntity })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ): Promise<UserEntity> {
    const authUser = req.user.email;
    return await this.deleteUserService.remove(id, authUser);
  }
}

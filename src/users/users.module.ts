import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CreateUserService } from './create-user/create-user.service';
import { FindOneUserService } from './find-one-user/find-one-user.service';
import { FindAllUserService } from './find-all-user/find-all-user.service';
import { UpdateUserService } from './update-user/update-user.service';
import { DeleteUserService } from './delete-user/delete-user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserService,
    FindOneUserService,
    FindAllUserService,
    UpdateUserService,
    DeleteUserService,
    DeleteUserService,
  ],
  imports: [PrismaModule, AuthModule],
  exports: [FindOneUserService],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { UserController, UsersService } from './user';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UsersService],
})
export class AppModule {}

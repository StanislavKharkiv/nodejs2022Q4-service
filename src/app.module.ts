import { Module } from '@nestjs/common';
import { UserController, UsersService } from './user';
import { ArtistController, ArtistService } from './artist';

@Module({
  imports: [],
  controllers: [UserController, ArtistController],
  providers: [UsersService, ArtistService],
})
export class AppModule {}

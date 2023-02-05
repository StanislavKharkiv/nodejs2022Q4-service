import { Module } from '@nestjs/common';
import { UserController, UsersService } from './user';
import { ArtistController, ArtistService } from './artist';
import { TrackController, TrackService } from './track';

@Module({
  imports: [],
  controllers: [UserController, ArtistController, TrackController],
  providers: [UsersService, ArtistService, TrackService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UserController, UsersService } from './user';
import { ArtistController, ArtistService } from './artist';
import { TrackController, TrackService } from './track';
import { AlbumController, AlbumService } from './album';
import { FavoriteController, FavoriteService } from './favorite';

@Module({
  imports: [],
  controllers: [
    UserController,
    ArtistController,
    TrackController,
    AlbumController,
    FavoriteController,
  ],
  providers: [
    UsersService,
    ArtistService,
    TrackService,
    AlbumService,
    FavoriteService,
  ],
})
export class AppModule {}

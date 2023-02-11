import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController, UsersService, User } from './user';
import { ArtistController, ArtistService } from './artist';
import { TrackController, TrackService } from './track';
import { AlbumController, AlbumService } from './album';
import { FavoriteController, FavoriteService } from './favorite';

const { POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } =
  process.env;

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_DB,
      port: +POSTGRES_PORT,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      entities: [User],
      synchronize: true,
    }),
  ],
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

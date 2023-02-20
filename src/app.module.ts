import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User, UserModule } from './user';
import { ArtistModule, Artist } from './artist';
import { Track, TrackModule } from './track';
import { Album, AlbumModule } from './album';
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
      entities: [User, Album, Artist, Track],
      synchronize: true,
      logging: true,
    }),
    UserModule,
    AlbumModule,
    ArtistModule,
    TrackModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

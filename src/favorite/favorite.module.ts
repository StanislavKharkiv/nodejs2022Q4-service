import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { AlbumModule } from 'src/album';
import { ArtistModule } from 'src/artist';
import { TrackModule } from 'src/track';

@Module({
  imports: [AlbumModule, ArtistModule, TrackModule],
  providers: [FavoriteService],
  controllers: [FavoriteController],
})
export class FavoriteModule {}

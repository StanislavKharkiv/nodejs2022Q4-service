import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './artist.entity';
import { ArtistService } from './artist.service';
import { ArtistController } from './artist.controller';
import { AlbumModule } from 'src/album';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), AlbumModule],
  providers: [ArtistService],
  controllers: [ArtistController],
})
export class ArtistModule {}

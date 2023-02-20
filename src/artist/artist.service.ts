import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { IArtist } from './interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { AlbumService } from 'src/album';
import { omit } from 'src/helpers';
import { TrackService } from 'src/track';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}

  create(artist: Omit<IArtist, 'id'>): Promise<IArtist> {
    const newArtist: IArtist = {
      id: uuidv4(),
      name: artist.name,
      grammy: artist.grammy,
    };
    return this.artistRepository.save(newArtist);
  }

  findAll(): Promise<IArtist[]> {
    return this.artistRepository.find();
  }

  findOne(artistId: IArtist['id']): Promise<IArtist | null> {
    return this.artistRepository.findOneBy({ id: artistId });
  }

  async remove(artistId: IArtist['id']) {
    const isExist = await this.artistRepository.findOneBy({ id: artistId });
    if (isExist) {
      await this.artistRepository.delete(artistId);
      await this.albumService.removeArtist(artistId);
      await this.trackService.removeArtist(artistId);
      return true;
    }
    return false;
  }

  async update(
    artistId: IArtist['id'],
    artistData: CreateArtistDto,
  ): Promise<IArtist> {
    const album = await this.artistRepository.findOneBy({ id: artistId });
    if (!album) return undefined;
    await this.artistRepository.update(artistId, artistData);
    return { ...album, ...artistData };
  }

  async findFavorite() {
    const favorites = await this.artistRepository.findBy({ favorite: true });
    return favorites.map((item) => omit(item, 'favorite'));
  }

  addToFavorite(id) {
    return this.artistRepository.update(id, { favorite: true });
  }

  removeFavorite(id) {
    return this.artistRepository.update(id, { favorite: false });
  }
}

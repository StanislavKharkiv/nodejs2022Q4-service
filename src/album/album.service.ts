import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { IAlbum } from './interfaces';
import { Album } from './album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrackService } from 'src/track';
import { omit } from 'src/helpers';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumsRepository: Repository<Album>,
    private trackService: TrackService,
  ) {}

  async create(album: Omit<IAlbum, 'id'>): Promise<IAlbum> {
    const newAlbum: IAlbum = {
      id: uuidv4(),
      name: album.name,
      artistId: album.artistId,
      year: album.year,
    };
    return await this.albumsRepository.save(newAlbum);
  }

  findAll(): Promise<IAlbum[]> {
    return this.albumsRepository.find();
  }

  findOne(albumId: IAlbum['id']): Promise<IAlbum | null> {
    return this.albumsRepository.findOneBy({ id: albumId });
  }

  async remove(albumId: IAlbum['id']) {
    const isExist = await this.albumsRepository.findOneBy({ id: albumId });
    if (isExist) {
      await this.albumsRepository.delete(albumId);
      await this.trackService.removeAlbum(albumId);
      return true;
    }
    return false;
  }

  async update(
    albumId: IAlbum['id'],
    albumData: CreateAlbumDto,
  ): Promise<IAlbum> {
    const album = await this.albumsRepository.findOneBy({ id: albumId });
    if (!album) return undefined;
    await this.albumsRepository.update(albumId, albumData);
    return { ...album, ...albumData };
  }

  removeArtist(artistId: IAlbum['id']) {
    return this.albumsRepository.update({ artistId }, { artistId: null });
  }

  async findFavorite() {
    const favorites = await this.albumsRepository.findBy({ favorite: true });
    return favorites.map((item) => omit(item, 'favorite'));
  }

  addToFavorite(id) {
    return this.albumsRepository.update(id, { favorite: true });
  }

  removeFavorite(id) {
    return this.albumsRepository.update(id, { favorite: false });
  }
}

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { IAlbum } from './interfaces';
import { Album } from './album.entity';
import DB from 'src/db';
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
    // DB.albums.push(newAlbum);
    // return newAlbum;
  }

  findAll(): Promise<IAlbum[]> {
    return this.albumsRepository.find();
    // return DB.albums;
  }

  findOne(albumId: IAlbum['id']): Promise<IAlbum | null> {
    // return DB.albums.find(({ id }) => id === albumId);
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
    // const filteredAlbums = DB.albums.filter(({ id }) => id !== albumId);
    // if (filteredAlbums.length === DB.albums.length) return false;
    // DB.albums = filteredAlbums;
    // // delete from other places
    // DB.favorites.albums = DB.favorites.albums.filter(
    //   (item) => item !== albumId,
    // );
    // DB.tracks = DB.tracks.map((item) => {
    //   if (item.albumId === albumId) return { ...item, albumId: null };
    //   return item;
    // });
    // return true;
  }

  async update(
    albumId: IAlbum['id'],
    albumData: CreateAlbumDto,
  ): Promise<IAlbum> {
    // const albumIndex = DB.albums.map(({ id }) => id).indexOf(albumId);
    // if (albumIndex === -1) return undefined;
    // DB.albums[albumIndex].name = albumData.name;
    // DB.albums[albumIndex].year = albumData.year;
    // DB.albums[albumIndex].artistId = albumData.artistId;
    // return DB.albums[albumIndex];
    const album = await this.albumsRepository.findOneBy({ id: albumId });
    if (!album) return undefined;
    await this.albumsRepository.update(albumId, albumData);
    return { ...album, ...albumData };
  }

  removeArtist(artistId: IAlbum['id']) {
    // TODO check is it work right
    return this.albumsRepository.update(
      { artistId: artistId },
      { artistId: null },
    );
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

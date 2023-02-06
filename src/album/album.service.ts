import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album } from './interfaces';
import DB from 'src/db';

@Injectable()
export class AlbumService {
  create(album: Omit<Album, 'id'>): Album {
    const newAlbum: Album = {
      id: uuidv4(),
      name: album.name,
      artistId: album.artistId,
      year: album.year,
    };
    DB.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return DB.albums;
  }

  findOne(albumId: Album['id']): Album | undefined {
    return DB.albums.find(({ id }) => id === albumId);
  }

  remove(albumId: Album['id']) {
    const filteredAlbums = DB.albums.filter(({ id }) => id !== albumId);
    if (filteredAlbums.length === DB.albums.length) return false;
    DB.albums = filteredAlbums;
    // delete from other places
    DB.favorites.albums = DB.favorites.albums.filter(
      (item) => item !== albumId,
    );
    const trackIndex = DB.tracks.findIndex((item) => item.albumId === albumId);
    if (trackIndex >= 0) DB.tracks[trackIndex].albumId = null;
    return true;
  }

  update(albumId: Album['id'], albumData: CreateAlbumDto): Album {
    const albumIndex = DB.albums.map(({ id }) => id).indexOf(albumId);
    if (albumIndex === -1) return undefined;
    DB.albums[albumIndex].name = albumData.name;
    DB.albums[albumIndex].year = albumData.year;
    DB.albums[albumIndex].artistId = albumData.artistId;
    return DB.albums[albumIndex];
  }
}

import { Injectable } from '@nestjs/common';
import { FavoritesType } from './interfaces';
import DB from 'src/db';

@Injectable()
export class FavoriteService {
  findAll() {
    const favs = DB.favorites;
    const artists = DB.artists.filter((item) => favs.artists.includes(item.id));
    const albums = DB.albums.filter((item) => favs.albums.includes(item.id));
    const tracks = DB.tracks.filter((item) => favs.tracks.includes(item.id));
    return { artists, albums, tracks };
  }

  add(id: string, category: FavoritesType) {
    const isExistId = DB[category].some((item) => item.id === id);
    if (isExistId) {
      const isExistInFavorite = DB.favorites[category].some(
        (item) => item === id,
      );
      if (!isExistInFavorite) DB.favorites[category].push(id);
      return true;
    }
    return false;
  }

  remove(id: string, category: FavoritesType) {
    const filtered = DB.favorites[category].filter((item) => item !== id);
    if (filtered.length === DB.favorites[category].length) return false;
    DB.favorites[category] = filtered;
    return true;
  }
}

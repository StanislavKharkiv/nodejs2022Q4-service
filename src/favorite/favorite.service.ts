import { Injectable } from '@nestjs/common';
import { FavoritesType } from './interfaces';
import DB from 'src/db';
import { AlbumService } from 'src/album';
import { ArtistService } from 'src/artist';
import { TrackService } from 'src/track';

@Injectable()
export class FavoriteService {
  #services = {
    tracks: this.trackService,
    albums: this.albumService,
    artists: this.artistService,
  };

  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
    private trackService: TrackService,
  ) {}

  async findAll() {
    // const favs = DB.favorites;
    // const artists = DB.artists.filter((item) => favs.artists.includes(item.id));
    // const albums = DB.albums.filter((item) => favs.albums.includes(item.id));
    // const tracks = DB.tracks.filter((item) => favs.tracks.includes(item.id));
    const artists = await this.artistService.findFavorite();
    const albums = await this.albumService.findFavorite();
    const tracks = await this.trackService.findFavorite();
    return { artists, albums, tracks };
  }

  async add(id: string, category: FavoritesType) {
    // const isExistId = DB[category].some((item) => item.id === id);
    // if (isExistId) {
    //   const isExistInFavorite = DB.favorites[category].some(
    //     (item) => item === id,
    //   );
    //   if (!isExistInFavorite) DB.favorites[category].push(id);
    //   return true;
    // }
    // return false;
    const item = await this.#services[category].findOne(id);
    if (item?.favorite === false) {
      await this.#services[category].addToFavorite(id);
      return true;
    }
    return false;
  }

  async remove(id: string, category: FavoritesType) {
    // const filtered = DB.favorites[category].filter((item) => item !== id);
    // if (filtered.length === DB.favorites[category].length) return false;
    // DB.favorites[category] = filtered;
    // return true;
    const item = await this.#services[category].findOne(id);
    if (item.favorite) {
      await this.#services[category].removeFavorite(id);
      return true;
    }
    return false;
  }
}

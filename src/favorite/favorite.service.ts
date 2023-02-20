import { Injectable } from '@nestjs/common';
import { FavoritesType } from './interfaces';
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
    const artists = await this.artistService.findFavorite();
    const albums = await this.albumService.findFavorite();
    const tracks = await this.trackService.findFavorite();
    return { artists, albums, tracks };
  }

  async add(id: string, category: FavoritesType) {
    const item = await this.#services[category].findOne(id);
    if (item?.favorite === false) {
      await this.#services[category].addToFavorite(id);
      return true;
    }
    return false;
  }

  async remove(id: string, category: FavoritesType) {
    const item = await this.#services[category].findOne(id);
    if (item.favorite) {
      await this.#services[category].removeFavorite(id);
      return true;
    }
    return false;
  }
}

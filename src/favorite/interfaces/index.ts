import { IAlbum } from 'src/album';
import { IArtist } from 'src/artist';
import { ITrack } from 'src/track';

export interface FavoritesResponse {
  artists: IArtist['id'][];
  albums: IAlbum['id'][];
  tracks: ITrack['id'][];
}

export type FavoritesType = keyof FavoritesResponse;

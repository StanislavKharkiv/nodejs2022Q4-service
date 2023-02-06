import { Album } from 'src/album';
import { Artist } from 'src/artist';
import { Track } from 'src/track';

export interface FavoritesResponse {
  artists: Artist['id'][];
  albums: Album['id'][];
  tracks: Track['id'][];
}

export type FavoritesType = keyof FavoritesResponse;

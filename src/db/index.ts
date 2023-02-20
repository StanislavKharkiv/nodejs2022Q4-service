import { IAlbum } from 'src/album';
import { IArtist } from 'src/artist';
import { ITrack } from 'src/track';
import { User } from 'src/user/interfaces';

interface DataBase {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
  users: User[];
  favorites: {
    artists: IArtist['id'][];
    albums: IAlbum['id'][];
    tracks: ITrack['id'][];
  };
}

const DB: DataBase = {
  artists: [],
  albums: [],
  tracks: [],
  users: [],
  favorites: { artists: [], albums: [], tracks: [] },
};

export default DB;

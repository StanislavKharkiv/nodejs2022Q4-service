import { Album } from 'src/album';
import { Artist } from 'src/artist';
import { Track } from 'src/track';
import { User } from 'src/user/interfaces';

interface DataBase {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
  users: User[];
  favorites: {
    artists: Artist['id'][];
    albums: Album['id'][];
    tracks: Track['id'][];
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

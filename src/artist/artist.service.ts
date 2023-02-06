import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './interfaces';
import DB from 'src/db';

@Injectable()
export class ArtistService {
  create(artist: Omit<Artist, 'id'>): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: artist.name,
      grammy: artist.grammy,
    };
    DB.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return DB.artists;
  }

  findOne(artistId: Artist['id']): Artist | undefined {
    return DB.artists.find(({ id }) => id === artistId);
  }

  remove(artistId: Artist['id']) {
    const filteredArtists = DB.artists.filter(({ id }) => id !== artistId);
    if (filteredArtists.length === DB.artists.length) return false;
    DB.artists = filteredArtists;
    // delete from other places
    DB.favorites.artists = DB.favorites.artists.filter(
      (item) => item !== artistId,
    );
    const trackIndex = DB.tracks.findIndex(
      (item) => item.artistId === artistId,
    );
    if (trackIndex >= 0) DB.tracks[trackIndex].artistId = null;
    return true;
  }

  update(artistId: Artist['id'], artistData: CreateArtistDto): Artist {
    const artistIndex = DB.artists.map(({ id }) => id).indexOf(artistId);
    if (artistIndex === -1) return undefined;
    DB.artists[artistIndex].name = artistData.name;
    DB.artists[artistIndex].grammy = artistData.grammy;
    return DB.artists[artistIndex];
  }
}

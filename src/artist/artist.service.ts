import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { Artist } from './interfaces';

@Injectable()
export class ArtistService {
  private artist: Artist[] = [];

  create(artist: Omit<Artist, 'id'>): Artist {
    const newArtist: Artist = {
      id: uuidv4(),
      name: artist.name,
      grammy: artist.grammy,
    };
    this.artist.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artist;
  }

  findOne(artistId: Artist['id']): Artist | undefined {
    return this.artist.find(({ id }) => id === artistId);
  }

  remove(artistId: Artist['id']) {
    const filteredArtists = this.artist.filter(({ id }) => id !== artistId);
    if (filteredArtists.length === this.artist.length) return false;
    this.artist = filteredArtists;
    return true;
  }

  update(artistId: Artist['id'], artistData: CreateArtistDto): Artist {
    const artistIndex = this.artist.map(({ id }) => id).indexOf(artistId);
    if (artistIndex === -1) return undefined;
    this.artist[artistIndex].name = artistData.name;
    this.artist[artistIndex].grammy = artistData.grammy;
    return this.artist[artistIndex];
  }
}

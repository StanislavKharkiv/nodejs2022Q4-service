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

  remove(userId: Artist['id']) {
    const filteredUsers = this.artist.filter(({ id }) => id !== userId);
    if (filteredUsers.length === this.artist.length) return false;
    this.artist = filteredUsers;
    return true;
  }

  update(userId: Artist['id'], artistData: CreateArtistDto): Artist {
    const userIndex = this.artist.map(({ id }) => id).indexOf(userId);
    if (userIndex === -1) return undefined;
    this.artist[userIndex].name = artistData.name;
    this.artist[userIndex].grammy = artistData.grammy;
    return this.artist[userIndex];
  }
}

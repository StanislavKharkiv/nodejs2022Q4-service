import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto } from './dto/create-artist.dto';
import { IArtist } from './interfaces';
import DB from 'src/db';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { AlbumService } from 'src/album';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private albumService: AlbumService,
  ) {}

  create(artist: Omit<IArtist, 'id'>): Promise<IArtist> {
    const newArtist: IArtist = {
      id: uuidv4(),
      name: artist.name,
      grammy: artist.grammy,
    };
    return this.artistRepository.save(newArtist);
    // DB.artists.push(newArtist);
    // return newArtist;
  }

  findAll(): Promise<IArtist[]> {
    return this.artistRepository.find();
    // return DB.artists;
  }

  findOne(artistId: IArtist['id']): Promise<IArtist | null> {
    return this.artistRepository.findOneBy({ id: artistId });
    // return DB.artists.find(({ id }) => id === artistId);
  }

  async remove(artistId: IArtist['id']) {
    const isExist = await this.artistRepository.findOneBy({ id: artistId });
    if (isExist) {
      await this.artistRepository.delete(artistId);
      await this.albumService.removeArtist(artistId);
      return true;
    }
    return false;
    // const filteredArtists = DB.artists.filter(({ id }) => id !== artistId);
    // if (filteredArtists.length === DB.artists.length) return false;
    // DB.artists = filteredArtists;
    // // delete from other places
    // DB.favorites.artists = DB.favorites.artists.filter(
    //   (item) => item !== artistId,
    // );
    // DB.tracks = DB.tracks.map((item) => {
    //   if (item.artistId === artistId) return { ...item, artistId: null };
    //   return item;
    // });
    // DB.albums = DB.albums.map((item) => {
    //   if (item.artistId === artistId) return { ...item, artistId: null };
    //   return item;
    // });
    // return true;
  }

  async update(
    artistId: IArtist['id'],
    artistData: CreateArtistDto,
  ): Promise<IArtist> {
    // const artistIndex = DB.artists.map(({ id }) => id).indexOf(artistId);
    // if (artistIndex === -1) return undefined;
    // DB.artists[artistIndex].name = artistData.name;
    // DB.artists[artistIndex].grammy = artistData.grammy;
    // return DB.artists[artistIndex];
    const album = await this.artistRepository.findOneBy({ id: artistId });
    if (!album) return undefined;
    await this.artistRepository.update(artistId, artistData);
    return { ...album, ...artistData };
  }
}

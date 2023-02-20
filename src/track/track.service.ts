import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { ITrack } from './interfaces';
import { Track } from './track.entity';
import { omit } from 'src/helpers';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  create(track: Omit<ITrack, 'id'>): Promise<ITrack> {
    const newTrack: ITrack = {
      id: uuidv4(),
      name: track.name,
      albumId: track.albumId,
      artistId: track.artistId,
      duration: track.duration,
    };
    return this.trackRepository.save(newTrack);
  }

  findAll() {
    return this.trackRepository.find();
  }

  findOne(trackId: ITrack['id']) {
    return this.trackRepository.findOneBy({ id: trackId });
  }

  async remove(trackId: ITrack['id']) {
    const isExist = await this.trackRepository.findOneBy({ id: trackId });
    if (isExist) {
      await this.trackRepository.delete(trackId);
      return true;
    }
    return false;
  }

  async update(trackId: ITrack['id'], trackData: CreateTrackDto) {
    const album = await this.trackRepository.findOneBy({ id: trackId });
    if (!album) return undefined;
    await this.trackRepository.update(trackId, trackData);
    return { ...album, ...trackData };
  }

  removeArtist(id) {
    this.trackRepository.update({ artistId: id }, { artistId: null });
  }

  removeAlbum(id) {
    this.trackRepository.update({ albumId: id }, { albumId: null });
  }

  async findFavorite() {
    const favorites = await this.trackRepository.findBy({ favorite: true });
    return favorites.map((item) => omit(item, 'favorite'));
  }

  addToFavorite(id) {
    return this.trackRepository.update(id, { favorite: true });
  }

  removeFavorite(id) {
    return this.trackRepository.update(id, { favorite: false });
  }
}

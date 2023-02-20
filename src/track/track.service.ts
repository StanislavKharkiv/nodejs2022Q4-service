import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrackDto } from './dto/create-track.dto';
import { ITrack } from './interfaces';
import DB from 'src/db';
import { Track } from './track.entity';

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
    // DB.tracks.push(newTrack);
    // return newTrack;
  }

  findAll() {
    // return DB.tracks;
    return this.trackRepository.find();
  }

  findOne(trackId: ITrack['id']) {
    return this.trackRepository.findOneBy({ id: trackId });
    // return DB.tracks.find(({ id }) => id === trackId);
  }

  async remove(trackId: ITrack['id']) {
    // const filteredTracks = DB.tracks.filter(({ id }) => id !== trackId);
    // if (filteredTracks.length === DB.tracks.length) return false;
    // DB.tracks = filteredTracks;
    // return true;
    const isExist = await this.trackRepository.findOneBy({ id: trackId });
    if (isExist) {
      await this.trackRepository.delete(trackId);
      return true;
    }
    return false;
  }

  async update(trackId: ITrack['id'], trackData: CreateTrackDto) {
    // const trackIndex = DB.tracks.map(({ id }) => id).indexOf(trackId);
    // if (trackIndex === -1) return undefined;
    // DB.tracks[trackIndex].name = trackData.name;
    // DB.tracks[trackIndex].albumId = trackData.albumId;
    // DB.tracks[trackIndex].artistId = trackData.artistId;
    // DB.tracks[trackIndex].duration = trackData.duration;
    // return DB.tracks[trackIndex];
    const album = await this.trackRepository.findOneBy({ id: trackId });
    if (!album) return undefined;
    await this.trackRepository.update(trackId, trackData);
    return { ...album, ...trackData };
  }
}

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces';
import DB from 'src/db';

@Injectable()
export class TrackService {
  private track: Track[] = DB.tracks;

  create(track: Omit<Track, 'id'>): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: track.name,
      albumId: track.albumId,
      artistId: track.artistId,
      duration: track.duration,
    };
    this.track.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return this.track;
  }

  findOne(trackId: Track['id']): Track | undefined {
    return this.track.find(({ id }) => id === trackId);
  }

  remove(trackId: Track['id']) {
    const filteredTracks = this.track.filter(({ id }) => id !== trackId);
    if (filteredTracks.length === this.track.length) return false;
    this.track = filteredTracks;
    return true;
  }

  update(trackId: Track['id'], trackData: CreateTrackDto): Track {
    const trackIndex = this.track.map(({ id }) => id).indexOf(trackId);
    if (trackIndex === -1) return undefined;
    this.track[trackIndex].name = trackData.name;
    this.track[trackIndex].albumId = trackData.albumId;
    this.track[trackIndex].artistId = trackData.artistId;
    this.track[trackIndex].duration = trackData.duration;
    return this.track[trackIndex];
  }
}

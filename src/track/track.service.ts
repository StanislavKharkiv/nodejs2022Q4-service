import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces';
import DB from 'src/db';

@Injectable()
export class TrackService {
  create(track: Omit<Track, 'id'>): Track {
    const newTrack: Track = {
      id: uuidv4(),
      name: track.name,
      albumId: track.albumId,
      artistId: track.artistId,
      duration: track.duration,
    };
    DB.tracks.push(newTrack);
    return newTrack;
  }

  findAll(): Track[] {
    return DB.tracks;
  }

  findOne(trackId: Track['id']): Track | undefined {
    return DB.tracks.find(({ id }) => id === trackId);
  }

  remove(trackId: Track['id']) {
    const filteredTracks = DB.tracks.filter(({ id }) => id !== trackId);
    if (filteredTracks.length === DB.tracks.length) return false;
    DB.tracks = filteredTracks;
    return true;
  }

  update(trackId: Track['id'], trackData: CreateTrackDto): Track {
    const trackIndex = DB.tracks.map(({ id }) => id).indexOf(trackId);
    if (trackIndex === -1) return undefined;
    DB.tracks[trackIndex].name = trackData.name;
    DB.tracks[trackIndex].albumId = trackData.albumId;
    DB.tracks[trackIndex].artistId = trackData.artistId;
    DB.tracks[trackIndex].duration = trackData.duration;
    return DB.tracks[trackIndex];
  }
}

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Track {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ default: null, nullable: true })
  artistId: string;

  @Column({ default: null, nullable: true })
  albumId: string;

  @Column()
  duration: number;
}

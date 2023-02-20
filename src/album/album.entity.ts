import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Album {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ default: null, nullable: true })
  artistId: string | null;
}

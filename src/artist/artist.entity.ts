import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Artist {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;
}

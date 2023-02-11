import { Entity, Column, Timestamp } from 'typeorm';

@Entity()
export class User {
  @Column()
  id: number;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  version: number;

  @Column()
  createdAt: Timestamp;

  @Column()
  updatedAt: Timestamp;
}

import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ default: 1 })
  version: number;

  @Column()
  createdAt: 'timestamp';

  @Column()
  updatedAt: 'timestamp';
}

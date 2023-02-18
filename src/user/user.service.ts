import { Injectable } from '@nestjs/common';
import { omit } from 'src/helpers';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto';
import { User, UserData } from './interfaces';
import DB from 'src/db';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from './user.entity';

@Injectable()
export class UserService {
  private users: User[] = DB.users;
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<User>,
  ) {}

  async create(user: Pick<User, 'login' | 'password'>): Promise<UserData> {
    const created = Date.now();
    const newUser: User = {
      login: user.login,
      password: user.password,
      id: uuidv4(),
      version: 1,
      createdAt: created,
      updatedAt: created,
    };
    await this.usersRepository.save(newUser);
    this.users.push(newUser);
    return omit(newUser, 'password');
  }

  async findAll(): Promise<UserData[]> {
    return this.users.map((user) => omit(user, 'password'));
  }

  findOne(userId: User['id']): UserData | false {
    const user = this.users.find(({ id }) => id === userId);
    if (user) return omit(user, 'password');
    return false;
  }

  remove(userId: User['id']) {
    const filteredUsers = this.users.filter(({ id }) => id !== userId);
    if (filteredUsers.length === this.users.length) return false;
    this.users = filteredUsers;
    return true;
  }

  update(userId: User['id'], userPassword: UpdateUserDto): UserData | number {
    const userIndex = this.users.map(({ id }) => id).indexOf(userId);
    if (userIndex === -1) return 404;
    if (this.users[userIndex].password !== userPassword.oldPassword) return 403;
    this.users[userIndex].password = userPassword.newPassword;
    this.users[userIndex].updatedAt = Date.now();
    this.users[userIndex].version += 1;
    return omit(this.users[userIndex], 'password');
  }
}

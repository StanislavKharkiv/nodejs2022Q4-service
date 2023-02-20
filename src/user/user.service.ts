import { Injectable } from '@nestjs/common';
import { omit } from 'src/helpers';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto';
import { User, UserData } from './interfaces';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from './user.entity';

@Injectable()
export class UserService {
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
    const savedUser = await this.usersRepository.save(newUser);
    return omit(savedUser, 'password');
  }

  async findAll(): Promise<UserData[]> {
    const users = await this.usersRepository.find();
    return users.map((user) => omit(user, 'password'));
  }

  async findOne(userId: User['id']): Promise<UserData | false> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (user) return omit(user, 'password');
    return false;
  }

  async remove(userId: User['id']) {
    const isExist = await this.usersRepository.findOneBy({ id: userId });
    if (isExist) {
      await this.usersRepository.delete(userId);
      return true;
    }
    return false;
  }

  async update(
    userId: User['id'],
    userPassword: UpdateUserDto,
  ): Promise<UserData | number> {
    const user = await this.usersRepository.findOneBy({ id: userId });
    if (!user) return 404;
    if (user.password !== userPassword.oldPassword) return 403;
    const updates = {
      password: userPassword.newPassword,
      updatedAt: Date.now(),
      version: user.version + 1,
    };
    await this.usersRepository.update(userId, updates);
    return omit(
      { ...user, ...updates, createdAt: +user.createdAt },
      'password',
    );
  }
}

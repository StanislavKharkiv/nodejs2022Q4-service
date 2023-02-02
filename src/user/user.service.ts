import { Injectable } from '@nestjs/common';
import { omit } from 'src/helpers';
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from './dto';

import { User, UserData } from './interfaces';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(user: Pick<User, 'login' | 'password'>) {
    const created = Date.now();
    const newUser: User = {
      login: user.login,
      password: user.password,
      id: uuidv4(),
      version: 1,
      createdAt: created,
      updatedAt: created,
    };
    this.users.push(newUser);
  }

  findAll(): UserData[] {
    return this.users.map((user) => omit(user, 'password'));
  }

  findOne(userId: User['id']): UserData | undefined {
    const user = this.users.find(({ id }) => id === userId);
    return omit(user, 'password');
  }

  remove(userId: User['id']) {
    const filteredUsers = this.users.filter(({ id }) => id !== userId);
    if (filteredUsers.length === this.users.length) return false;
    this.users = filteredUsers;
    return true;
  }

  update(userId: User['id'], userPassword: UpdateUserDto) {
    const userIndex = this.users.map(({ id }) => id).indexOf(userId);
    if (userIndex === -1) return 404;
    if (this.users[userIndex].password !== userPassword.oldPassword) return 403;
    this.users[userIndex].password = userPassword.newPassword;
    return 200;
  }
}

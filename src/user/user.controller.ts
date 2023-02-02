import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { validate } from 'uuid';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersService } from './user.service';
import { hasProperties } from 'src/helpers';
import { TEXT } from 'src/constants';

@Controller('user')
export class UserController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() newUser: CreateUserDto, @Res() res: Response) {
    const isValidData = hasProperties(newUser, ['login', 'password']);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });

    const user = this.usersService.create(newUser);
    res.status(HttpStatus.CREATED).send(user);
  }

  @Get()
  findAll(@Res() res: Response) {
    const users = this.usersService.findAll();
    res.status(HttpStatus.OK).send(users);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const user = this.usersService.findOne(id);
    if (user) return res.status(HttpStatus.OK).send(user);
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.userNotFound });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Res() res: Response,
  ) {
    // id validation
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });
    // check required fields
    const requiredFields = ['oldPassword', 'newPassword'];
    const isValidData = hasProperties(updateData, requiredFields);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });
    // update user
    const updateResp = this.usersService.update(id, updateData);
    if (updateResp === 404)
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({ message: TEXT.userNotFound });
    if (updateResp === 403)
      return res
        .status(HttpStatus.FORBIDDEN)
        .send({ message: TEXT.wrongPassword });

    res.status(HttpStatus.OK).send(updateResp);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isDeleted = this.usersService.remove(id);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: TEXT.userNotFound });
  }
}

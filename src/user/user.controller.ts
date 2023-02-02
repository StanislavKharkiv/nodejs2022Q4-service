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
      return res.status(HttpStatus.BAD_REQUEST).send(TEXT.requiredFields);
    this.usersService.create(newUser);
    res.status(HttpStatus.CREATED).send(TEXT.userCreated);
  }

  @Get()
  findAll(@Res() res: Response) {
    const users = this.usersService.findAll();
    res.status(HttpStatus.OK).send(users);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send(TEXT.wrongId);

    const user = this.usersService.findOne(id);
    if (user) return res.status(HttpStatus.OK).send(user);
    res.status(HttpStatus.NOT_FOUND).send(TEXT.userNotFound);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: UpdateUserDto,
    @Res() res: Response,
  ) {
    // id validation
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send(TEXT.wrongId);
    // check required fields
    const requiredFields = ['oldPassword', 'newPassword'];
    const isValidData = hasProperties(updateData, requiredFields);
    if (!isValidData)
      return res.status(HttpStatus.BAD_REQUEST).send(TEXT.requiredFields);
    // update user
    const statusCode = this.usersService.update(id, updateData);
    if (statusCode === 404)
      return res.status(HttpStatus.NOT_FOUND).send(TEXT.userNotFound);
    if (statusCode === 403)
      return res.status(HttpStatus.FORBIDDEN).send(TEXT.wrongPassword);

    res.status(HttpStatus.OK).send();
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send(TEXT.wrongId);

    const isDeleted = this.usersService.remove(id);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res.status(HttpStatus.NOT_FOUND).send(TEXT.userNotFound);
  }
}

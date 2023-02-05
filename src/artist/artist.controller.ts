import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { CreateArtistDto } from './dto/create-artist.dto';
import { TEXT } from 'src/constants';
import { hasProperties } from 'src/helpers';
import { ArtistService } from './artist.service';

@Controller('artist')
export class ArtistController {
  constructor(private artistService: ArtistService) {}

  @Post()
  create(@Body() newArtist: CreateArtistDto, @Res() res: Response) {
    const isValidData = hasProperties(newArtist, ['name', 'grammy']);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });

    const user = this.artistService.create(newArtist);
    res.status(HttpStatus.CREATED).send(user);
  }

  @Get()
  findAll(@Res() res: Response) {
    const users = this.artistService.findAll();
    res.status(HttpStatus.OK).send(users);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const artist = this.artistService.findOne(id);
    if (artist) return res.status(HttpStatus.OK).send(artist);
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.userNotFound });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isDeleted = this.artistService.remove(id);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res
      .status(HttpStatus.NOT_FOUND)
      .send({ message: TEXT.userNotFound });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: CreateArtistDto,
    @Res() res: Response,
  ) {
    // id validation
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });
    // check required fields
    const isValidData = hasProperties(updateData, ['name', 'grammy']);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });
    // update user
    const updateResp = this.artistService.update(id, updateData);
    if (updateResp) return res.status(HttpStatus.OK).send(updateResp);
    // if user not found
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.userNotFound });
  }
}

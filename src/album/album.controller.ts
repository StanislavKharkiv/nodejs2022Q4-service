import {
  Controller,
  Res,
  Body,
  Post,
  Get,
  Delete,
  HttpStatus,
  Put,
  Param,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { TEXT } from 'src/constants';
import { hasProperties } from 'src/helpers';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private albumService: AlbumService) {}

  @Post()
  create(@Body() newAlbum: CreateAlbumDto, @Res() res: Response) {
    const isValidData = hasProperties(newAlbum, ['name', 'year', 'artistId']);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });

    const album = this.albumService.create(newAlbum);
    res.status(HttpStatus.CREATED).send(album);
  }

  @Get()
  findAll(@Res() res: Response) {
    const albums = this.albumService.findAll();
    res.status(HttpStatus.OK).send(albums);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const album = this.albumService.findOne(id);
    if (album) return res.status(HttpStatus.OK).send(album);
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isDeleted = this.albumService.remove(id);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: CreateAlbumDto,
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
    // update
    const updateResp = this.albumService.update(id, updateData);
    if (updateResp) return res.status(HttpStatus.OK).send(updateResp);
    // not found
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }
}

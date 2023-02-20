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
  #requiredFields = [
    { name: 'name', type: ['string'] },
    { name: 'year', type: ['number'] },
    { name: 'artistId', type: ['string', 'null'] },
  ];

  @Post()
  async create(@Body() newAlbum: CreateAlbumDto, @Res() res: Response) {
    const isValidData = hasProperties(newAlbum, this.#requiredFields);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });

    const album = await this.albumService.create(newAlbum);
    res.status(HttpStatus.CREATED).send(album);
  }

  @Get()
  async findAll(@Res() res: Response) {
    const albums = await this.albumService.findAll();
    res.status(HttpStatus.OK).send(albums);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const album = await this.albumService.findOne(id);
    if (album) return res.status(HttpStatus.OK).send(album);
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isDeleted = await this.albumService.remove(id);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: CreateAlbumDto,
    @Res() res: Response,
  ) {
    // id validation
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });
    // check required fields
    const isValidData = hasProperties(updateData, this.#requiredFields);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });
    // update
    const updateResp = await this.albumService.update(id, updateData);
    if (updateResp) return res.status(HttpStatus.OK).send(updateResp);
    // not found
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }
}

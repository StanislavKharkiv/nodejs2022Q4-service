import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { validate } from 'uuid';
import { Response } from 'express';
import { FavoriteService } from './favorite.service';
import { TEXT } from 'src/constants';
import { FavoritesType } from './interfaces';

@Controller('favs')
export class FavoriteController {
  constructor(private favoritesService: FavoriteService) {}

  async #addFavorite(type: FavoritesType, id: string, res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isAdded = await this.favoritesService.add(id, type);
    if (isAdded) {
      return res
        .status(HttpStatus.CREATED)
        .send({ message: TEXT.addedToFavorite });
    }
    res
      .status(HttpStatus.UNPROCESSABLE_ENTITY)
      .send({ message: TEXT.notFound });
  }

  async #removeFavorite(type: FavoritesType, id: string, res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isDeleted = await this.favoritesService.remove(id, type);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFavorite });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const favorites = await this.favoritesService.findAll();
    res.status(HttpStatus.OK).send(favorites);
  }

  @Post('track/:id')
  addTrack(@Param('id') id: string, @Res() res: Response) {
    this.#addFavorite('tracks', id, res);
  }

  @Post('album/:id')
  addAlbum(@Param('id') id: string, @Res() res: Response) {
    this.#addFavorite('albums', id, res);
  }

  @Post('artist/:id')
  addArtist(@Param('id') id: string, @Res() res: Response) {
    this.#addFavorite('artists', id, res);
  }

  @Delete('track/:id')
  removeTrack(@Param('id') id: string, @Res() res: Response) {
    this.#removeFavorite('tracks', id, res);
  }

  @Delete('album/:id')
  removeAlbum(@Param('id') id: string, @Res() res: Response) {
    this.#removeFavorite('albums', id, res);
  }

  @Delete('artist/:id')
  removeArtist(@Param('id') id: string, @Res() res: Response) {
    this.#removeFavorite('artists', id, res);
  }
}

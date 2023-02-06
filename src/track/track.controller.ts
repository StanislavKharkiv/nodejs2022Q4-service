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
import { Response } from 'express';
import { TEXT } from 'src/constants';
import { hasProperties } from 'src/helpers';
import { validate } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private trackService: TrackService) {}

  #requiredFields = [
    { name: 'name', type: ['string'] },
    { name: 'artistId', type: ['string', 'null'] },
    { name: 'albumId', type: ['string', 'null'] },
    { name: 'duration', type: ['number'] },
  ];

  @Post()
  create(@Body() newTrack: CreateTrackDto, @Res() res: Response) {
    const isValidData = hasProperties(newTrack, this.#requiredFields);
    if (!isValidData)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send({ message: TEXT.requiredFields });

    const track = this.trackService.create(newTrack);
    res.status(HttpStatus.CREATED).send(track);
  }

  @Get()
  findAll(@Res() res: Response) {
    const track = this.trackService.findAll();
    res.status(HttpStatus.OK).send(track);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const track = this.trackService.findOne(id);
    if (track) return res.status(HttpStatus.OK).send(track);
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Res() res: Response) {
    if (!validate(id))
      return res.status(HttpStatus.BAD_REQUEST).send({ message: TEXT.wrongId });

    const isDeleted = this.trackService.remove(id);
    if (isDeleted) return res.status(HttpStatus.NO_CONTENT).send();

    return res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: CreateTrackDto,
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
    const updateResp = this.trackService.update(id, updateData);
    if (updateResp) return res.status(HttpStatus.OK).send(updateResp);
    // if not found
    res.status(HttpStatus.NOT_FOUND).send({ message: TEXT.notFound });
  }
}

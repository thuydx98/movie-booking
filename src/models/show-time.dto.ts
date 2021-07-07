import { ApiProperty } from '@nestjs/swagger';
import { Cinema } from 'src/entities/cinema.entity';
import { Movie } from 'src/entities/movie.entity';
import { ShowTime } from 'src/entities/show-time.entity';

export class GetListShowTimeDto {
  @ApiProperty({ type: Date, required: false })
  public date: Date;
  @ApiProperty({ type: Number, required: false })
  public movieId: number;
  @ApiProperty({ type: Number, required: false })
  public branchId: number;
  @ApiProperty({ type: Number, required: false })
  public cinemaId: number;
}

export class ShowTimeDto {
  id: number;
  startAt: Date;
  endAt: Date;
  cinema: Cinema;
  movie: Movie;

  constructor(show: ShowTime) {
    this.id = show.id;
    this.startAt = show.startAt;
    this.endAt = show.endAt;
    this.cinema = show.cinema;
    this.movie = show.movie;
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { PagingDto, Public } from 'src/constants/app.const';
import { GetPagingListMovieDto, MovieDto } from 'src/models/movie.dto';
import { MoviesService } from 'src/services/movies.service';

@Controller('api/movies')
export class MoviesController {
  constructor(private movieService: MoviesService) {}

  @Get()
  @Public()
  async getPagingList(
    @Query() params: GetPagingListMovieDto,
  ): Promise<PagingDto<MovieDto>> {
    return await this.movieService.getPagingList(params);
  }
}

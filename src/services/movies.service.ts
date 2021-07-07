import { MovieSortType } from 'src/constants/movie.const';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PagingDto } from 'src/constants/app.const';
import { GetPagingListMovieDto, MovieDto } from 'src/models/movie.dto';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import { EntityFieldsNames } from 'typeorm/common/EntityFieldsNames';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async getPagingList(
    params: GetPagingListMovieDto,
  ): Promise<PagingDto<MovieDto>> {
    if (params.sort === MovieSortType.View) {
      return await this.getPagingListSortByView(params);
    }

    let order: {
      [P in EntityFieldsNames<Movie>]?: 'ASC' | 'DESC' | 1 | -1;
    };

    switch (params.sort) {
      case MovieSortType.Name:
        order = { name: 'ASC' };
        break;
      case MovieSortType.Newest:
        order = { publishAt: 'DESC' };
        break;
    }

    const [movies, total] = await this.moviesRepository.findAndCount({
      order: order,
      skip: (params.page - 1) * params.size,
      take: params.size,
    });

    return new PagingDto<MovieDto>(
      params.page,
      params.size,
      total,
      movies.map((item) => new MovieDto(item)),
    );
  }

  private async getPagingListSortByView(
    params: GetPagingListMovieDto,
  ): Promise<PagingDto<MovieDto>> {
    const total = await this.moviesRepository.count();
    const movies = await this.moviesRepository
      .createQueryBuilder('movie')
      .leftJoinAndSelect('movie.showTimes', 'showTime')
      .leftJoinAndSelect('showTime.bookings', 'booking')
      .skip((params.page - 1) * params.size)
      .take(params.size)
      .getMany()
      .then((data) =>
        data
          .map((a) => ({
            ...a,
            totalViews: a.showTimes.reduce((a, b) => a + b.bookings.length, 0),
          }))
          .sort((a, b) => b.totalViews - a.totalViews),
      );

    return new PagingDto<MovieDto>(
      params.page,
      params.size,
      total,
      movies.map((item) => new MovieDto(item)),
    );
  }
}

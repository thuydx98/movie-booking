import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetListShowTimeDto, ShowTimeDto } from 'src/models/show-time.dto';
import { Repository } from 'typeorm';
import { ShowTime } from '../entities/show-time.entity';

@Injectable()
export class ShowTimesService {
  constructor(
    @InjectRepository(ShowTime)
    private showTimesRepository: Repository<ShowTime>,
  ) {}

  async getOne(id: number): Promise<ShowTime> {
    return this.showTimesRepository.findOne({ where: { id } });
  }

  async getList(params: GetListShowTimeDto): Promise<ShowTimeDto[]> {
    const condition: string[] = [];
    if (params.branchId) {
      condition.push(`branch.id = ${params.branchId}`);
    }
    if (params.movieId) {
      condition.push(`movie.id = ${params.movieId}`);
    }
    if (params.cinemaId) {
      condition.push(`cinema.id = ${params.cinemaId}`);
    }
    if (params.date) {
      condition.push(
        `show_time.startAt >= '${new Date(params.date).toISOString()}'::date`,
      );
    }

    const whereQuery = condition.join(' and ');
    const showTimes = await this.showTimesRepository
      .createQueryBuilder('show_time')
      .leftJoinAndSelect('show_time.cinema', 'cinema')
      .leftJoinAndSelect('cinema.branch', 'branch')
      .leftJoinAndSelect('show_time.movie', 'movie')
      .where(whereQuery || '1 = 1')
      .getMany();

    return showTimes.map((item) => new ShowTimeDto(item));
  }
}

import { Cinema } from 'src/entities/cinema.entity';
import { Movie } from 'src/entities/movie.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShowTimeDto, GetListShowTimeDto, ShowTimeDto } from 'src/models/show-time.dto';
import { Repository } from 'typeorm';
import { ShowTime } from '../entities/show-time.entity';

@Injectable()
export class ShowTimesService {
	constructor(
		@InjectRepository(ShowTime)
		private showTimesRepository: Repository<ShowTime>,
		@InjectRepository(Movie)
		private moviesRepository: Repository<Movie>,
		@InjectRepository(Cinema)
		private cinemasRepository: Repository<Cinema>
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
		if (params.startTime) {
			const date = this.formatDate(new Date(params.startTime), 'yyyy-MM-dd hh:mm:ss');
			condition.push(`show_time.startAt >= '${date}'::timestamp`);
		}
		if (params.endTime) {
			const date = this.formatDate(new Date(new Date(params.endTime).getTime() + 1000 * 60 * 60 * 24), 'yyyy-MM-dd hh:mm:ss');;
			condition.push(`show_time.startAt < '${date}'::timestamp`);
		}
		const whereQuery = condition.join(' and ');
		const showTimes = await this.showTimesRepository
			.createQueryBuilder('show_time')
			.leftJoinAndSelect('show_time.bookings', 'bookings')
			.leftJoinAndSelect('bookings.tickets', 'tickets')
			.leftJoinAndSelect('show_time.cinema', 'cinema')
			.leftJoinAndSelect('cinema.branch', 'branch')
			.leftJoinAndSelect('show_time.movie', 'movie')
			.where(whereQuery || '1 = 1')
			.orderBy('show_time.startAt', 'ASC')
			.getMany();

		return showTimes.map((item) => new ShowTimeDto(item));
	}

	async create(dto: CreateShowTimeDto): Promise<ShowTimeDto> {
		const movie = await this.moviesRepository.findOne({ where: { id: dto.movieId } });
		const cinema = await this.cinemasRepository.findOne({ where: { id: dto.cinemaId } });

		const showTime = await this.showTimesRepository.save({ ...dto, movie, cinema });
		return new ShowTimeDto(showTime);
	}

	async delete(id: any): Promise<void> {
		await this.showTimesRepository.delete(id);
	}

	private formatDate(date, format) {
		var z = {
			M: date.getMonth() + 1,
			d: date.getDate(),
			h: date.getHours(),
			m: date.getMinutes(),
			s: date.getSeconds()
		};
		format = format.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
			return ((v.length > 1 ? "0" : "") + z[v.slice(-1)]).slice(-2)
		});
	
		return format.replace(/(y+)/g, function(v) {
			return date.getFullYear().toString().slice(-v.length)
		});
	}
}

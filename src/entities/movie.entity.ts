import { ShowTime } from './show-time.entity';
import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ type: 'timestamp' })
  publishAt: Date;

  @Column()
  posterUrl: string;

  @Column()
  duration: number;

  @OneToMany(() => ShowTime, (showTime) => showTime.movie)
  showTimes: ShowTime[];
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './configs/app.config';
import * as fromEntities from './entities';

const entities = [
  fromEntities.Booking,
  fromEntities.Branch,
  fromEntities.Cinema,
  fromEntities.Movie,
  fromEntities.ShowTime,
  fromEntities.Ticket,
  fromEntities.User,
];

@Module({
  imports: [
    TypeOrmModule.forRoot(AppConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [],
  providers: []
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './configs/app.config';
import entities from './entities';
import controllers from './controllers';
import services from './services';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: controllers,
  providers: services,
})
export class AppModule {}

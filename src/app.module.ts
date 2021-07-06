import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AppConfig } from './configs/app.config';
import entities from './entities';
import controllers from './controllers';
import services from './services';
import { JWT_SECRET } from './constants/auth.const';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './passports/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forRoot(AppConfig.getTypeOrmConfig()),
    TypeOrmModule.forFeature(entities),
    PassportModule.register({ session: true }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),
  ],
  controllers: controllers,
  providers: [
    ...services,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

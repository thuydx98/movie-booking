import { User } from 'src/entities/user.entity';
import { HttpCode, HttpException, HttpStatus } from '@nestjs/common';
import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto, SignInDto } from '../models/request/user.dto';
import { UsersService } from 'src/services/users.service';
import { Public } from 'src/constants/app.const';

@Public()
@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  @Post('sign-in')
  @HttpCode(200)
  async signIn(@Body() dto: SignInDto): Promise<any> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }
    if (!user.isActive) {
      throw new HttpException('user-not-verify-yet', HttpStatus.BAD_REQUEST);
    }

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) {
      throw new HttpException('user-not-exist', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user.id,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    };
  }

  @Post('sign-up')
  @HttpCode(200)
  async signUp(@Body() dto: SignUpDto): Promise<void> {
    let user = await this.userService.findByEmail(dto.email);
    if (user) {
      throw new HttpException('user-exist', HttpStatus.BAD_REQUEST);
    }

    const code = Math.floor(Math.random() * (99999 - 10000) + 10000);
    user = new User();
    user.name = dto.name;
    user.email = dto.email;
    user.password = bcrypt.hashSync(dto.password, 10);
    user.isActive = false;
    user.activationCode = code.toString();

    await this.userService.create(user);
  }
}

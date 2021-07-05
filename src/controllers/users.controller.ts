import { Controller } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}
}

import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // No public CRUD endpoints are needed here because 
  // the AuthController securely handles user registration and login!
}
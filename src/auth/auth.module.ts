import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'SUPER_SECRET_KEY_DO_NOT_USE_IN_PROD', 
      signOptions: { expiresIn: '1h' }, // Tokens expire in 1 hour
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
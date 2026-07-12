import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      throw new UnauthorizedException('Authentication token missing');
    }

    const token = authHeader.split(' ')[1]; // Extracts token from "Bearer <token>"
    
    try {
      // Secret must match the one in your AuthModule
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SUPER_SECRET_KEY_DO_NOT_USE_IN_PROD', 
      });
      request['user'] = payload; // Attaches user info to the request
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}
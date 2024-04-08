import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authServicer: AuthService,
  ) {};
  // EL context: ExecutionContext, es el contexto donde se esta ejecuntado.
  async canActivate( context: ExecutionContext, ): Promise<boolean> { //tipos de datos que regresa.
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    };
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        token, { secret: process.env.JWT_SEED }
      );

      const user = await this.authServicer.findUserById( payload.id );
      if( !user ) throw new UnauthorizedException( 'User does not exists' );
      if( !user.isActivate ) throw new UnauthorizedException( 'User is not active' );


      request['user'] = user;

    } catch (error) {
      throw new UnauthorizedException('Error token no valido')
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

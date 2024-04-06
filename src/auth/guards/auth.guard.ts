import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {};
  // EL context: ExecutionContext, es el contexto donde se esta ejecuntado.
  canActivate( context: ExecutionContext, ): Promise<boolean> { //tipos de datos que regresa.
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('There is no bearer token');
    };
    
    console.log(token);
    
    return Promise.resolve(true);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

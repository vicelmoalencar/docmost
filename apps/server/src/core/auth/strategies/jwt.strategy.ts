import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { EnvironmentService } from '../../../integrations/environment/environment.service';
import { JwtPayload, JwtType } from '../dto/jwt-payload';
import { WorkspaceRepo } from '@docmost/db/repos/workspace/workspace.repo';
import { UserRepo } from '@docmost/db/repos/user/user.repo';
import { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userRepo: UserRepo,
    private workspaceRepo: WorkspaceRepo,
    private readonly environmentService: EnvironmentService,
  ) {
    super({
      jwtFromRequest: (req: FastifyRequest) => {
        let accessToken = null;

        try {
          accessToken = JSON.parse(req.cookies?.authTokens)?.accessToken;
        } catch {}

        return accessToken || this.extractTokenFromHeader(req);
      },
      ignoreExpiration: false,
      secretOrKey: environmentService.getAppSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: JwtPayload) {
    if (!payload.workspaceId || payload.type !== JwtType.ACCESS) {
      throw new UnauthorizedException();
    }

    // CLOUD ENV
    if (this.environmentService.isCloud()) {
      if (req.raw.workspaceId && req.raw.workspaceId !== payload.workspaceId) {
        throw new BadRequestException('Workspace does not match');
      }
    }

    const workspace = await this.workspaceRepo.findById(payload.workspaceId);

    if (!workspace) {
      throw new UnauthorizedException();
    }
    const user = await this.userRepo.findById(payload.sub, payload.workspaceId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return { user, workspace };
  }

  private extractTokenFromHeader(request: FastifyRequest): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

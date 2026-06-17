import {
  BaseApplication,
  IApplicationConfigs,
  IApplicationInfo,
  ValueOrPromise,
  SwaggerComponent,
  SwaggerBindingKeys,
  ISwaggerOptions,
  HealthCheckComponent,
  AuthenticateComponent,
  AuthenticateBindingKeys,
  AuthenticationStrategyRegistry,
  Authentication,
  JWSAuthenticationStrategy,
  JOSEStandards,
  TJWTTokenServiceOptions,
} from '@venizia/ignis';
import { cors } from 'hono/cors';

import { PostgresDataSource } from '@/datasources/postgres.datasource';
import { UserRepository } from '@/repositories/user.repository';
import { PostRepository } from '@/repositories/post.repository';
import { CommentRepository } from '@/repositories/comment.repository';
import { LikeRepository } from '@/repositories/like.repository';
import { AuthService } from '@/services/auth.service';
import { PostService } from '@/services/post.service';
import { CommentService } from '@/services/comment.service';
import { LikeService } from '@/services/like.service';
import { AuthController } from '@/controllers/auth.controller';
import { PostController } from '@/controllers/post.controller';
import { CommentController } from '@/controllers/comment.controller';
import { LikeController } from '@/controllers/like.controller';

export const appConfigs: IApplicationConfigs = {
  host: process.env.APP_ENV_SERVER_HOST ?? 'localhost',
  port: +(process.env.APP_ENV_SERVER_PORT ?? process.env.PORT ?? 3000),
  path: {
    base: '',
    isStrict: false,
  },
  debug: {
    shouldShowRoutes: true,
  },
};

export class Application extends BaseApplication {
  constructor() {
    super({ scope: Application.name, config: appConfigs });
    this.init();
  }

  override getAppInfo(): IApplicationInfo {
    return {
      name: 'Blog API',
      version: '1.0.0',
      description: 'A blog API built with IGNIS',
    };
  }

  staticConfigure(): void {}

  preConfigure(): ValueOrPromise<void> {
    //Swagger
    this.bind<ISwaggerOptions>({
      key: SwaggerBindingKeys.SWAGGER_OPTIONS,
    }).toValue({
      restOptions: {
        base: { path: '/docs' },
        doc: { path: '/openapi.json' },
        ui: { path: '/explorer', type: 'swagger' },
      },
      explorer: {
        openapi: '3.0.0',
        servers: [{ url: 'http://localhost:3000' }],
      },
    });

    this.component(SwaggerComponent);
    this.component(HealthCheckComponent);

    //Auth
    this.bind<TJWTTokenServiceOptions>({
      key: AuthenticateBindingKeys.JWT_OPTIONS,
    }).toValue({
      standard: JOSEStandards.JWS,
      options: {
        jwtSecret: process.env.APP_ENV_JWT_SECRET!,
        getTokenExpiresFn: () => 86400,
      },
    });

    this.component(AuthenticateComponent);
    AuthenticationStrategyRegistry.getInstance().register({
      container: this,
      strategies: [
        { name: Authentication.STRATEGY_JWT, strategy: JWSAuthenticationStrategy },
      ],
    });

  
    this.dataSource(PostgresDataSource);

    this.repository(UserRepository);
    this.repository(PostRepository);
    this.repository(CommentRepository);
    this.repository(LikeRepository);

    this.service(AuthService);
    this.service(PostService);
    this.service(CommentService);
    this.service(LikeService);

    this.controller(AuthController);
    this.controller(PostController);
    this.controller(CommentController);
    this.controller(LikeController);
  }

  postConfigure(): ValueOrPromise<void> {}

  setupMiddlewares(): ValueOrPromise<void> {
    const server = this.getServer();
    server.use('*', cors({
      origin: 'http://localhost:5173',
      credentials: true,
    }));
  }
}
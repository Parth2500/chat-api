import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      connectTimeoutMS: 40000,
      logger: 'simple-console',
      synchronize: true,
      retryAttempts: 5,
      retryDelay: 5000,
    }),
    UserModule,
    ChatModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/users', method: RequestMethod.POST },
        { path: '/users/login', method: RequestMethod.POST },
      )
      .forRoutes('');
  }
}

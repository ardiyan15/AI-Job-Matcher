import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenaiService } from './openai/openai.service';
import { DashboardModule } from './dashboard/dashboard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get("DB_HOST"),
        port: config.get<number>('DB_PORT'),
        username: config.get("DB_USERNAME"),
        password: config.get("DB_PASSWORD"),
        database: config.get("DB_NAME"),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        seeds: ['dist/database/seeds/*.js']
      })
    }),
    AuthModule,
    UserModule,
    CvModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}

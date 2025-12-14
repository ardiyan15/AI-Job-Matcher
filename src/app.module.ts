import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CvModule } from './cv/cv.module';
import { ConfigModule } from '@nestjs/config';
import { OpenaiService } from './openai/openai.service';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    CvModule,
    DashboardModule
  ],
  controllers: [AppController],
  providers: [AppService, OpenaiService],
})
export class AppModule {}

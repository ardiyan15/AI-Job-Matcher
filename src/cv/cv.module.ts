import { Module } from '@nestjs/common';
import { CvController } from './cv.controller';
import { CvService } from './cv.service';
import { OpenaiService } from 'src/openai/openai.service';

@Module({
  controllers: [CvController],
  providers: [CvService, OpenaiService]
})
export class CvModule {}

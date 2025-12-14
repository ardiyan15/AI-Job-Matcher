import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { OpenaiService } from 'src/openai/openai.service';

@Controller('cv')
export class CvController {
    constructor(
        private readonly cvService: CvService,
        private readonly openAiService: OpenaiService
    ) { }

    @Get('upload')
    showUploadForm() {

        let precentage = 50;
        let bgColor = 'bg-danger';

        if (precentage >= 50 && precentage <= 69) {
            bgColor = 'bg-warning';
        } else if (precentage >= 70) {
            bgColor = 'bg-success';
        }

        return { bgColor }
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadCV(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        const jobDesc = body.job_desc
        const text = await this.cvService.extractText(file);
        const analysis = await this.openAiService.analyzeCv(text, jobDesc);

        let overallScore = analysis.overallScore
        let skillMatches = analysis.skillMatches
        let strengths = analysis.strengths
        let improvements = analysis.improvements

        return {
            overallScore,
            skillMatches,
            strengths,
            improvements
        }
    }
}

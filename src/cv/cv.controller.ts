import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CvService } from './cv.service';
import { OpenaiService } from 'src/openai/openai.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth.guard';

@Controller('cv')
export class CvController {
    constructor(
        private readonly cvService: CvService,
        private readonly openAiService: OpenaiService
    ) { }

    @Get('upload')
    @UseGuards(SupabaseAuthGuard)
    @Render('pages/upload')
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
    @Render('pages/result')
    async uploadCV(@Body() body: any, @UploadedFile() file: Express.Multer.File) {
        const jobDesc = body.job_desc
        const text = await this.cvService.extractText(file);
        const analysis = await this.openAiService.analyzeCv(text, jobDesc);

        console.log(analysis);

        let precentage = analysis.presentase;
        let bgColor = 'bg-danger';

        if (precentage >= 50 && precentage <= 69) {
            bgColor = 'bg-warning';
        } else if (precentage >= 70) {
            bgColor = 'bg-success';
        }

        let cvSkills = analysis.skill_cv
        let skillRequirements = analysis.skill_requirement
        let skillNotMets = analysis.skill_not_met
        let summaries = analysis.summary
        let advices = analysis.saran

        return { cvSkills, skillRequirements, skillNotMets, summaries, advices, bgColor, precentage }
    }
}

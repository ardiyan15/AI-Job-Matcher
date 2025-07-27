import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class CvService {
    async extractText(file: Express.Multer.File): Promise<string> {
        const mime = file.mimetype

        if(mime === 'application/pdf') {
            return this.extractPdf(file.buffer)
        } else {
            throw new Error("File type not supported")
        }
    }

    private async extractPdf(buffer: Buffer): Promise<string> {
        const data = await pdfParse(buffer)
        return data.text
    }
}

import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai'

@Injectable()
export class OpenaiService {
    private openai: OpenAI

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
    }

    async analyzeCv(cvText: string, jobDesc: string): Promise<any> {
        const prompt = `
                        ${cvText}
                        Tolong ekstrak informasi penting dan bandingkan dengan deskripsi pekerjaan berikut: ${jobDesc}. Berikan kecocokan secara objektif pekerjaan dalam bentuk presentase, serta berikan saran apabila untuk memperbaiki CV serta apabila ada requirement yang belum terpenuhi. Jawab *hanya* dalam format JSON tanpa dibungkus oleh blok kode Markdown (seperti \`\`\`json atau \`\`\`), dan tanpa penjelasan tambahan:
                        {
                        "skill_cv": ["skill1", "skill2", "skill3"],
                        "skill_requirement": ["skill1", "skill2", "skill3"],
                        "skill_not_met": ["skill1", "skill2", "skill3"],
                        "summary": "summary dalam bentuk deskripsi dari kecocokan CV deskripsi pekerjaan",
                        "presentase": "kecocokan cv dengan deskripsi pekerjaan dalam skala 1 sampai 100",
                        "saran": "saran untuk bagian CV yang harus diperbaiki atau bisa pelajari skill teknis maupun non-teknis sesuai deskripsi pekerjaan yang belum terpenuhi. Berikan rekomendasi tempat belajar skill yang belum terpenuhi"
                        }
                    `;

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2
        })

        const content = response.choices[0].message.content;

        try {
            return JSON.parse(content)
        } catch {
            return { raw: content }
        }
    }
}

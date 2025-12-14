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

    async analyzeCv(cvText: string, jobDesc: string) {
        const system = `
            You are an ATS job matching assistant.
            Return ONLY valid JSON. No markdown. No extra text.
            Use Indonesian for strengths and improvements.
            If a skill is not explicitly present in CV text, set matched=false and evidenceQuote=null.
            `;

                    const user = `
            You will do TWO steps internally:
            Step 1: Extract required skills from JOB_DESCRIPTION (6-12 items max).
            Step 2: Compare CV_TEXT vs required skills and return the final JSON.

            <<<CV_TEXT>>>
            ${cvText}
            <<<END_CV_TEXT>>>

            <<<JOB_DESCRIPTION>>>
            ${jobDesc}
            <<<END_JOB_DESCRIPTION>>>

            Return JSON with EXACT schema:

            {
            "overallScore": number,
            "requiredSkills": string[],
            "skillMatches": [
                {
                "skill": string,
                "matched": boolean,
                "level": "strong" | "partial" | "missing",
                "evidenceQuote": string | null
                }
            ],
            "strengths": string[],
            "improvements": string[]
            }

            Rules:
            - requiredSkills MUST come from JOB_DESCRIPTION only.
            - skillMatches MUST contain EXACTLY the same skills as requiredSkills (same order).
            - evidenceQuote is a short direct quote from CV_TEXT (max 160 chars) if matched=true, else null.
            - overallScore must be consistent with how many skills are matched and the levels.
            - No trailing commas, no comments, no semicolons.
        `;

        const response = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: system.trim() },
                { role: "user", content: user.trim() },
            ],
            temperature: 0.2,
        });

        const content = response.choices[0]?.message?.content?.trim() ?? "";
        return this.safeJsonParse(content);
    }

    private async safeJsonParse(text: string) {
        // 1) Try direct parse
        try {
            return JSON.parse(text);
        } catch { }

        // 2) Try extract JSON object from text (kalau ada prefix/suffix)
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}");
        if (start !== -1 && end !== -1 && end > start) {
            const sliced = text.slice(start, end + 1);
            try {
                return JSON.parse(sliced);
            } catch { }
        }

        // 3) Return raw for debugging
        return { raw: text };
    }
}

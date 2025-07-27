import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { getSupabaseClient } from '../supabase/supabase.client';

@Injectable()
export class AuthService {

    async login(body: any, res: Response) {
        const {email, password} = body

        const supabase = getSupabaseClient()
        const {data, error } = await supabase.auth.signInWithPassword({
            email, password
        })

        if(error) {
            return {message: "Login gagal", error}
        }

        res.cookie("access_token", data.session.access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            maxAge: 60 * 60 * 1000
        })

        if(error) {
            return {message: "Login gagal", error}
        }

        return { message: "Login berhasil", data }
    }
}

import { Controller, Post, Body, Res, Redirect } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@supabase/supabase-js';

interface LoginResult {
    user: User
}

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("/login")
    // @Redirect("/cv/upload")
    async login(@Res({ passthrough: true }) res, @Body() body: any) {
        let result = await this.authService.login(body, res)

        if (result.message === 'Login gagal') {
            return res.render('pages/auth/index', {
                layout: false,
                error: 'Invalid username or password',
            });
        }

        return res.redirect("/cv/upload")
    }

    @Post("/logout")
    @Redirect("/")
    async logout(@Res({ passthrough: true }) res) {
        res.clearCookie('access_token')
        return { message: "Logout berhasil" }
    }
}

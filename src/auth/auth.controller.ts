import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto)
    }

    @Post('refresh')
    refresh(@Body() body: { username: number, refreshToken: string }) {
        return this.authService.refresh(body.username, body.refreshToken)
    }

    @UseGuards(JwtAccessGuard)
    @Post('logout')
    logout(@Req() req: any) {
        return this.authService.logout(req.user.userName)
    }
}

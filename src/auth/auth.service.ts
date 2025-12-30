import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly jwt: JwtService,
        private readonly cfg: ConfigService
    ) { }

    private async signAccessToken(user: { id: number, username: string }) {
        const expiresIn = (this.cfg.get('JWT_ACCESS_EXPIRES_IN') ?? '15m') as JwtSignOptions['expiresIn']
        return this.jwt.signAsync(
            {
                sub: user.id,
                username: user.username
            },
            {
                secret: this.cfg.get<string>("JWT_ACCESS_SECRET"),
                expiresIn
            }
        )
    }

    private async signRefreshToken(user: { id: number, username: string }) {
        const expiresIn = (this.cfg.get("JWT_REFRESH_EXPIRES_IN") ?? '7d') as JwtSignOptions['expiresIn']

        return this.jwt.signAsync(
            { sub: user.id, username: user.username },
            {
                secret: this.cfg.get<string>('JWT_REFRESH_SECRET'),
                expiresIn,
            },
        )
    }

    private async setRefreshToken(userId: number, refreshToken: string) {
        const hash = await bcrypt.hash(refreshToken, 10)
        await this.userRepo.update({ id: userId }, { refreshTokenHash: hash })
    }

    async login(dto: LoginDto) {
        const user = await this.userRepo
            .createQueryBuilder('u')
            .addSelect('u.password')
            .where('u.username = :username', { username: dto.username })
            .getOne();

        if (!user) throw new UnauthorizedException('Invalid credentials');

        const ok = await bcrypt.compare(dto.password, user.password);

        if (!ok) throw new UnauthorizedException("Invalid credentials");

        const accessToken = await this.signAccessToken(user);
        const refreshToken = await this.signRefreshToken(user);
        await this.setRefreshToken(user.id, refreshToken);

        return {
            user: { id: user.id, username: user.username, email: user.email, role: user.role },
            accessToken,
            refreshToken
        }
    }

    async refresh(username: number, refreshToken: string) {
        const user = await this.userRepo
            .createQueryBuilder('u')
            .addSelect('u.refreshTokenHash')
            .where('u.username = :username', { username: username })
            .getOne();

        if(!user || !user.refreshTokenHash) throw new UnauthorizedException('Refresh denied');

        const ok = await bcrypt.compare(refreshToken, user.refreshTokenHash);

        if(!ok) throw new UnauthorizedException('Refresh denied');

        const accessToken = await this.signAccessToken(user);
        const newRefreshToken = await this.signRefreshToken(user);
        await this.setRefreshToken(user.id, newRefreshToken);

        return { accessToken, refreshToken: newRefreshToken}
    }

    async logout(userId: number) {
        await this.userRepo.update({ id: userId }, { refreshTokenHash: null })
        return { success: true }
    }
}

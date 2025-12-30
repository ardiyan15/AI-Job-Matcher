import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResponseDto } from "./dto/user-response.dto";
import { plainToInstance } from "class-transformer";

@Controller('users')
export class UserController {

    constructor(
        private readonly userService: UserService
    ) { }

    @Get()
    async getUsers(): Promise<UserResponseDto[]> {
        const users = await this.userService.findAll();

        return plainToInstance(UserResponseDto, users, {
            excludeExtraneousValues: true
        })
    }
}
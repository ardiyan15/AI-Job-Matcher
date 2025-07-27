import { Controller, Get, Render } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
    
    @Get("/")
    @Render("pages/dashboard")
    index() {
        return {}
    }
}

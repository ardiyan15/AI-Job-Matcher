import { Controller, Get, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { GuestGuard } from './auth/guards/guest.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @UseGuards(GuestGuard)
  @Get()
  @Render('pages/auth/index')
  index() {
    return {layout: false, error: null}
  }
}

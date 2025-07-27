import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { getSupabaseClient } from '../../supabase/supabase.client';

@Injectable()
export class GuestGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const token = request.cookies['access_token'];

    if (!token) return true;

    const supabase = getSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser(token)

    if (user) {
      response.redirect("/cv/upload");
      return false
    }

    return true
  }
}

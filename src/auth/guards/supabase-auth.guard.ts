import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { getSupabaseClient } from "../../supabase/supabase.client";

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const token = request.cookies['access_token'];

        if (!token) {
            response.redirect("/")
            return false;
        }

        const supabase = getSupabaseClient();
        const {data: {user}, error} = await supabase.auth.getUser(token)

        if(error || !user) {
            response.redirect("/")
            return false
        }

        request.user = user
        return true
    }
}
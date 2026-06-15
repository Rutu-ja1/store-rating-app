// src/auth/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        // ✅ if no roles defined on route, allow all logged in users
        if (!roles || roles.length === 0) return true;

        const { user } = context.switchToHttp().getRequest();

        // ✅ if no user in request, block
        if (!user) return false;

        return roles.includes(user.role);
    }
}
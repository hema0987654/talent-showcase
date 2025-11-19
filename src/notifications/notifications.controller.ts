import { Controller, Get, Post, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/decorator/roles/roles.guard';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { UserRole } from 'src/users/Entity/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard,RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Role(UserRole.ADMIN)
  async create(@Body('userId') userId: number, @Body('message') message: string) {
    return this.notificationsService.create(userId, message);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId') userId: number) {
    return this.notificationsService.findByUser(userId);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId);
  }

  @Patch('user/:userId/read-all')
  async markAllAsRead(@Param('userId') userId: number) {
    return this.notificationsService.markAllAsRead(userId);
  }
}

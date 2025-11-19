import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: number, message: string): Promise<NotificationDocument> {
    try {
      const notification = new this.notificationModel({ userId, message });
      return await notification.save();
    } catch (error) {
      throw new HttpException(
        `Failed to create notification: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUser(userId: number): Promise<NotificationDocument[]> {
    try {
      const notifications = await this.notificationModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();

      if (!notifications || notifications.length === 0) {
        throw new HttpException(
          'No notifications found for this user',
          HttpStatus.NOT_FOUND,
        );
      }

      return notifications;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch notifications: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAsRead(notificationId: string): Promise<NotificationDocument> {
    try {
      const notification = await this.notificationModel.findById(notificationId);

      if (!notification) {
        throw new HttpException(
          'Notification not found',
          HttpStatus.NOT_FOUND,
        );
      }

      notification.read = true;
      return await notification.save();
    } catch (error) {
      throw new HttpException(
        `Failed to mark notification as read: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAllAsRead(userId: number): Promise<{ modifiedCount: number }> {
    try {
      const result = await this.notificationModel.updateMany(
        { userId, read: false },
        { $set: { read: true } },
      );

      return { modifiedCount: result.modifiedCount };
    } catch (error) {
      throw new HttpException(
        `Failed to mark all notifications as read: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

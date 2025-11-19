import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UsersModule } from 'src/users/users.module';
import { WorksModule } from 'src/works/works.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports:[TypeOrmModule.forFeature([Order]),UsersModule,WorksModule,NotificationsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}

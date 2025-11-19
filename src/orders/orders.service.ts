import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { WorksService } from 'src/works/works.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UpdateOrderDto } from './dto/update-order-admin';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly workService: WorksService,
    private readonly notificationService: NotificationsService
  ) { }

  async create(createOrderDto: CreateOrderDto, userId: number) {
    try {
      const buyer = await this.usersService.findById(userId);
      const work = await this.workService.findOne(createOrderDto.workId);

      if (!work) throw new NotFoundException('Work not found');

      const order = this.orderRepository.create({
        work,
        buyer,
        total_price: work.price,
        payment_info: { status: 'pending', method: createOrderDto.payment_info },
      });

      const orderSave = await this.orderRepository.save(order);

      await this.notificationService.create(
        buyer.id,
        `You successfully purchased the work "${work.title}" for $${work.price}`
      );

      await this.notificationService.create(
        work.artist.id,
        `Your work "${work.title}" has been purchased by ${buyer.first_name} ${buyer.last_name}`
      );
      return orderSave
    } catch (error) {
      throw new HttpException(
        `Failed to create order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findAllByUser(userId: number) {
    try {
      return await this.orderRepository.find({
        where: { buyer: { id: userId } },
        order: { created_at: 'DESC' },
        relations: ['work', 'buyer'],
      });
    } catch (error) {
      throw new HttpException(
        `Failed to findAllByUser order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async findOne(id: number) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['work', 'buyer'],
      });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw new HttpException(
        `Failed to findOne order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.findOne(id);
      let oldStatus = order.status;


      if (updateOrderDto.status) {
        order.status = updateOrderDto.status;
      }

      if (updateOrderDto.payment_info) {
        order.payment_info = { ...order.payment_info, ...updateOrderDto.payment_info };
      }

      if (updateOrderDto.status && updateOrderDto.status !== oldStatus) {
        const message = `Your order #${order.id} status changed from "${oldStatus}" to "${updateOrderDto.status}"`;

        await this.notificationService.create(order.buyer.id, message);

        await this.notificationService.create(
          order.work.artist.id,
          `Order #${order.id} for your work "${order.work.title}" status changed from "${oldStatus}" to "${updateOrderDto.status}"`
        );
      }

      return await this.orderRepository.save(order);
    } catch (error) {
      throw new HttpException(
        `Failed to update order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async remove(id: number) {
    try {
      const order = await this.findOne(id);
      const messageBuyer = `Your order #${order.id} for "${order.work.title}" has been removed.`;
      const messageArtist = `Order #${order.id} for your work "${order.work.title}" has been removed.`;
      try {
        await this.notificationService.create(order.buyer.id, messageBuyer);
        await this.notificationService.create(order.work.artist.id, messageArtist);
      } catch (err) {
        console.error('Notification error:', err.message);
      }
      return await this.orderRepository.remove(order);
    } catch (error) {
      throw new HttpException(
        `Failed to remove order: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

}

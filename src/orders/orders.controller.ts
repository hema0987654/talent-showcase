import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  ParseIntPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { UserRole } from 'src/users/Entity/user.entity';
import { UpdateOrderDto } from './dto/update-order-admin';

@UseGuards(JwtAuthGuard) 
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  
  @Role(UserRole.BUYER)
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    const userId = req.user.id; 
    return await this.ordersService.create(createOrderDto, userId);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.id;
    return await this.ordersService.findAllByUser(userId);
  }

  @Get(':id')
  async findOne(@Param('id',ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    const order = await this.ordersService.findOne(id);

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyer.id !== userId) throw new ForbiddenException('Access denied');

    return order;
  }

  @Role(UserRole.ADMIN)
  @Patch(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto, @Req() req) {
    const userId = req.user.id;
    const order = await this.ordersService.findOne(+id);

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyer.id !== userId) throw new ForbiddenException('Access denied');

    return await this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id',ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.id;
    const order = await this.ordersService.findOne(id);

    if (!order) throw new NotFoundException('Order not found');
    if (order.buyer.id !== userId) throw new ForbiddenException('Access denied');

    return await this.ordersService.remove(+id);
  }
}

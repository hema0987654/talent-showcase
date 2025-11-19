import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/Entity/user.entity';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { RolesGuard } from 'src/auth/guards/decorator/roles/roles.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Role(UserRole.ADMIN)
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return await this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Role(UserRole.ADMIN)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.categoriesService.remove(id);
    return { message: `Category with ID ${id} has been removed successfully.` };
  }
}

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new HttpException(
        `Failed to create category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        relations: ['works'],
      });
    } catch (error) {
      throw new HttpException(
        `Failed to findAll category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['works'],
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      return category;
    } catch (error) {
      throw new HttpException(
        `Failed to findOne category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      const category = await this.findOne(id);
      Object.assign(category, updateCategoryDto);
      return await this.categoryRepository.save(category);
    } catch (error) {
      throw new HttpException(
        `Failed to update category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const category = await this.findOne(id);
      await this.categoryRepository.remove(category);
    } catch (error) {
      throw new HttpException(
        `Failed to remove category: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

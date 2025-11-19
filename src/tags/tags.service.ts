import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) { }

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    try {
      const existing = await this.tagRepository.findOne({ where: { name: createTagDto.name } });
      if (existing) {
        throw new HttpException('Tag already exists', HttpStatus.CONFLICT);
      }

      const tag = this.tagRepository.create(createTagDto);
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw new HttpException(
        `Failed to create tag: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Tag[]> {
    try {
      return await this.tagRepository.find({ relations: ['work'] });
    } catch (error) {
      throw new HttpException(
        `Failed to finAll tag: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Tag> {
    try {
      const tag = await this.tagRepository.findOne({ where: { id }, relations: ['work'] });
      if (!tag) {
        throw new HttpException('Tag not found', HttpStatus.NOT_FOUND);
      }
      return tag;
    } catch (error) {
      throw new HttpException(
        `Failed to findOne tag: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      const tag = await this.findOne(id);

      if (updateTagDto.name && updateTagDto.name !== tag.name) {
        const existing = await this.tagRepository.findOne({ where: { name: updateTagDto.name } });
        if (existing) {
          throw new HttpException('Tag name already exists', HttpStatus.CONFLICT);
        }
      }

      Object.assign(tag, updateTagDto);
      return await this.tagRepository.save(tag);
    } catch (error) {
      throw new HttpException(
        `Failed to update tag: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const tag = await this.findOne(id);
      await this.tagRepository.remove(tag);
      return { message: `Tag with ID ${id} has been removed successfully.` };
    } catch (error) {
      throw new HttpException(
        `Failed to remove tag: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

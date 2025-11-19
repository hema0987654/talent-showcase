import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWorkDto } from './dto/create-work.dto';
import { UpdateWorkDto } from './dto/update-work.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { Repository, In } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { Category } from 'src/categories/entities/category.entity';
import { UserRole } from 'src/users/Entity/user.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class WorksService {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
    private readonly userRepository: UsersService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(createWorkDto: CreateWorkDto, artistId: number) {
    const findUser = await this.userRepository.findById(artistId);
    if (findUser.role !== UserRole.ARTIST) {
      throw new HttpException('User is not an artist', HttpStatus.CONFLICT);
    }

    const { categories: categoryIds, tags: tagIds, ...rest } = createWorkDto;

    const work = this.workRepository.create({ ...rest, artist: findUser });

    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });

      work.categories = categories;
    }

    if (Array.isArray(tagIds) && tagIds.length > 0) {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });

      work.tags = tags;
    }

    await this.workRepository.save(work);
    await this.notificationsService.create(
      artistId,
      `Your work "${work.title}" has been successfully uploaded!`,
    );
    return work;
  }

  async findAll() {
    return await this.workRepository.find({
      relations: ['artist', 'categories', 'tags'],
    });
  }

  async findOne(id: number) {
    const work = await this.workRepository.findOne({
      where: { id },
      relations: ['artist', 'categories', 'tags'],
    });
    if (!work) throw new HttpException('Work not found', HttpStatus.NOT_FOUND);
    return work;
  }

  async update(id: number, updateWorkDto: UpdateWorkDto, artistId: number) {
    const work = await this.findOne(id);

    if (work.artist.id !== artistId) {
      throw new HttpException(
        'You are not allowed to update this work',
        HttpStatus.FORBIDDEN,
      );
    }

    const {
      title,
      description,
      price,
      categories: categoryIds,
      tags: tagIds,
    } = updateWorkDto;

    Object.assign(work, { title, description, price });

    if (Array.isArray(categoryIds)) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      work.categories = categories;
    }

    if (Array.isArray(tagIds)) {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });
      work.tags = tags;
    }

    return this.workRepository.save(work);
  }

  async remove(id: number, artistId: number) {
    const work = await this.findOne(id);

    if (work.artist.id !== artistId) {
      throw new HttpException(
        'You are not allowed to delete this work',
        HttpStatus.FORBIDDEN,
      );
    }

    await this.workRepository.remove(work);
    return { message: 'Work deleted successfully' };
  }
}

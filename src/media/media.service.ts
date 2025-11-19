import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { WorksService } from 'src/works/works.service';

@Injectable()
export class MediaService {
  constructor
    (
      @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
      private readonly workSerivce: WorksService,

    ) { }
  async create(createMediaDto: CreateMediaDto, work_id: number) {
    try {
      const work = await this.workSerivce.findOne(work_id);
      const media = this.mediaRepository.create({
        url: createMediaDto.url,
        type: createMediaDto.type,
        work: work
      })
      await this.mediaRepository.save(media)
      return media
    } catch (error) {
      throw new HttpException(
        `Failed to create media: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      const mediaList = await this.mediaRepository.find({
        relations: {
          work: {
            artist: true,
            categories: true,
            tags: true
          }
        }
      });
      

      return {
        message: 'Media fetched successfully',
        media: mediaList,
      };
    } catch (error) {
      throw new HttpException(
        `Failed to findAll media: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByWorkId(work_id: number) {
    try {
      const media = await this.mediaRepository.find({
        where: { work: { id: work_id } },
        relations:{work:{
          artist:true,
          categories:true,
          tags:true
        }}
      });
      console.log(media);
      if (!media.length) throw new HttpException('Work not found', HttpStatus.NOT_FOUND);
      return media; 
    } catch (error) {
      throw new HttpException(
        `Failed to findByWorkId media: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFile(id: number, newUrl: string, work_id: number, artistId: number) {
    try {
      const media = await this.mediaRepository.findOne({
        where: { id },
        relations: ['work', 'work.artist'],
      });

      if (!media) {
        throw new HttpException('Media not found', 404);
      }

      if (media.work.id !== work_id) {
        throw new HttpException('Media does not belong to this work', 400);
      }

      if (media.work.artist.id !== artistId) {
        throw new HttpException('Forbidden', 403);
      }
      media.url = newUrl;

      return await this.mediaRepository.save(media);
    } catch (error) {
      throw new HttpException(
        `Failed to update media: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async remove(id: number, work_id: number, artistId: number) {
    try {
      const work = await this.workSerivce.findOne(work_id);

      if (work.artist.id !== artistId) {
        throw new HttpException(
          'You are not allowed to delete this media',
          HttpStatus.FORBIDDEN,
        );
      }
      const media = await this.mediaRepository.findOne({
        where: { id },
        relations: ['work'],
      });
      if (!media) {
        throw new HttpException('Media not found', HttpStatus.NOT_FOUND);
      }
      if (media.work.id !== work_id) {
        throw new HttpException(
          'Media does not belong to this work',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.mediaRepository.remove(media);

      return { message: 'Media removed successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to remove media: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

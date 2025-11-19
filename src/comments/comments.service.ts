import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { WorksService } from 'src/works/works.service';
import { UsersService } from 'src/users/users.service';
import { UserRole } from 'src/users/Entity/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly workService: WorksService,
    private readonly userService: UsersService,
  ) { }

  async create(createCommentDto: CreateCommentDto, workID: number, userID: number) {

    try {
      const work = await this.workService.findOne(workID);

      const user = await this.userService.findById(userID);

      const comment = this.commentRepository.create({
        content: createCommentDto.content,
        rating: createCommentDto.rating,
        user: user,
        work: work
      });

      const saved = await this.commentRepository.save(comment);

      return saved;
    } catch (error) {
      throw new HttpException(
        `Failed to create comments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    try {
      return await this.commentRepository.find({
        relations: ['user', 'work'],
      });
    } catch (error) {
      throw new HttpException(
        `Failed to findAll comments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const comment = await this.commentRepository.findOne({
        where: { id },
        relations: ['user', 'work'],
      });

      if (!comment) {
        throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
      }

      return comment;
    } catch (error) {
      throw new HttpException(
        `Failed to findone comments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.findOne(id);

      Object.assign(comment, updateCommentDto);

      return await this.commentRepository.save(comment);
    } catch (error) {
      throw new HttpException(
        `Failed to update comments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const comment = await this.findOne(id);
      await this.commentRepository.remove(comment);

      return { message: 'Comment deleted successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to remove comments: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

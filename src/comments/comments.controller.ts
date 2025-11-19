import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRole } from 'src/users/Entity/user.entity';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { RolesGuard } from 'src/auth/guards/decorator/roles/roles.guard';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Role(UserRole.BUYER)
  @Post(':workId')
  create(
    @Param('workId', ParseIntPipe) workId: number,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    const userID = req.user.id;
    return this.commentsService.create(createCommentDto, workId, userID);
  }

  @Get()
  findAll() {
    return this.commentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Role(UserRole.BUYER)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(id, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(UserRole.BUYER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.remove(id);
  }
}

import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  ParseIntPipe, 
  UseGuards 
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { UserRole } from 'src/users/Entity/user.entity';

@Controller('tags')
@UseGuards(JwtAuthGuard) 
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Role(UserRole.ADMIN) 
  async create(@Body() createTagDto: CreateTagDto): Promise<Tag> {
    return await this.tagsService.create(createTagDto);
  }

  @Get()
  async findAll(): Promise<Tag[]> {
    return await this.tagsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Tag> {
    return await this.tagsService.findOne(id);
  }

  @Patch(':id')
  @Role(UserRole.ADMIN) 
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto
  ): Promise<Tag> {
    return await this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Role(UserRole.ADMIN) 
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return await this.tagsService.remove(id);
  }
}

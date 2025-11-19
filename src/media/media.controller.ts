import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { MediaType } from './entities/media.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/auth/guards/decorator/roles/role.decorator';
import { UserRole } from 'src/users/Entity/user.entity';
import { RolesGuard } from 'src/auth/guards/decorator/roles/roles.guard';

@Controller('media')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MediaController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly uploadService: UploadService,
  ) { }
  @Role(UserRole.ARTIST)
  @Post('work/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @Param('id', ParseIntPipe) work_id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const url: string = (await this.uploadService.uploadFile(file)) as string;
    const type: MediaType = file.mimetype.startsWith('image')
      ? MediaType.IMAGE
      : MediaType.VIDEO;
    const media = await this.mediaService.create(
      {
        url,
        type,
      },
      work_id,
    );
    return {
      message: 'Media uploaded successfully',
      media,
    };
  }


  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':workId')
  findOne(@Param('workId',ParseIntPipe) workId: number) {
    return this.mediaService.findByWorkId(workId);
  }

  @Role(UserRole.ARTIST)
  @Patch(':id/:work_id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Param('work_id', ParseIntPipe) work_id: number,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const artistId = req.user.id;

    const url: string = (await this.uploadService.uploadFile(file)) as string;

    return await this.mediaService.updateFile(
      id,
      url,
      work_id,
      artistId,
    );
  }

  @Role(UserRole.ARTIST)
  @Delete(':id/:work_id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Param('work_id', ParseIntPipe) work_id: number,
    @Req() req,
  ) {
    const artistId = req.user.id;
    return await this.mediaService.remove(id, work_id, artistId);
  }
}

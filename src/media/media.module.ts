import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { UploadModule } from 'src/upload/upload.module';
import { WorksModule } from 'src/works/works.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Media]),UploadModule,WorksModule],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}

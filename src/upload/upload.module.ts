import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { CloudinaryProvider } from 'src/config/cloudinary.config';

@Module({
  providers: [UploadService,CloudinaryProvider],
  controllers: [UploadController],
  exports:[UploadService]
})
export class UploadModule {}

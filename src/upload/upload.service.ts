import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  async uploadFile(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
      const filePath = path.join(__dirname, file.originalname);
    fs.writeFileSync(filePath, file.buffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath, 
        { resource_type: 'auto' },
        (error, result) => {
          fs.unlinkSync(filePath); 
          if (error) return reject(error);
          if (!result) return reject(new Error('No result returned from Cloudinary'));
          resolve(result.secure_url);
        },
      );
    });
  }
}

import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Work } from './entities/work.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { Category } from 'src/categories/entities/category.entity';
import { TagsModule } from 'src/tags/tags.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Tag } from 'src/tags/entities/tag.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Work,Category,Tag]),UsersModule,AuthModule,CategoriesModule,TagsModule,NotificationsModule],
  controllers: [WorksController],
  providers: [WorksService],
  exports:[WorksService]
})
export class WorksModule {}

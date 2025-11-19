import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Media } from 'src/media/entities/media.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/Entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @ManyToOne(() => User, (user) => user.works, { onDelete: 'CASCADE' })
  artist: User;

  @OneToMany(() => Media, (media) => media.work)
  media: Media[];

  @OneToMany(() => Order, (order) => order.work)
  orders: Order[];

  @OneToMany(() => Comment, (comment) => comment.work)
  comments: Comment[];

  @ManyToMany(() => Category, (category) => category.works)
  @JoinTable({
    name: 'work_category',
    joinColumn: { name: 'work_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: Category[];


  @ManyToMany(() => Tag, (tag) => tag.work)
  @JoinTable({
    name: 'work_tag',
    joinColumn: { name: 'work_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

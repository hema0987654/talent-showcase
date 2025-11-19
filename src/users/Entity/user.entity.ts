import { Comment } from "src/comments/entities/comment.entity";
import { Order } from "src/orders/entities/order.entity";
import { Work } from "src/works/entities/work.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    ARTIST = 'artist',
    BUYER = 'buyer',
}
@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
    role: UserRole;

    @OneToMany(() => Work, (work) => work.artist)
    works: Work[];

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ default: false })
    is_active: boolean;

    @OneToMany(()=>Order,(order)=>order.buyer)
    orders: Order[];

    @OneToMany(()=>Comment,(comment)=>comment.user)
    comments:Comment[];
    
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

}
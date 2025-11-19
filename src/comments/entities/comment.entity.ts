import { User } from "src/users/Entity/user.entity";
import { Work } from "src/works/entities/work.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('comment')
export class Comment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column({type:"int"})
    rating: number;

    @ManyToOne(() => Work, (work) => work.comments ,{onDelete:"CASCADE"})
    work: Work

    @ManyToOne(() => User, (user) => user.comments,{onDelete:"CASCADE"})
    user: User;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updated_at: Date

}

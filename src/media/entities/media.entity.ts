import { Work } from "src/works/entities/work.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video'
}

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column({
        type: 'enum',
        enum: MediaType
    })
    type: MediaType;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Work, (work) => work.media, { onDelete: 'CASCADE' })
    work: Work;
}

import { Work } from "src/works/entities/work.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('tags')
export class Tag {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    name:string;

    @ManyToMany(()=>Work,(work)=>work.tags)
    work:Work[];
}

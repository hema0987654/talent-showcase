import { Work } from "src/works/entities/work.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string;

    @Column({ type: "text", nullable: true })
    description: string;


    @ManyToMany(() => Work, (work) => work.categories)
    works: Work[];

}

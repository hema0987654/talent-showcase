import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "src/users/Entity/user.entity";
import { Work } from "src/works/entities/work.entity";

export enum Status_enum {
  PENDING = "pending",
  COMPLETED = "completed",
  CANCELED = "canceled",
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: Status_enum,
    default: Status_enum.PENDING,
  })
  status: Status_enum;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: "json", nullable: true })
  payment_info: any;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: "CASCADE" })
  buyer: User;

  @ManyToOne(() => Work, (work) => work.orders, { onDelete: "CASCADE" })
  work: Work;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}

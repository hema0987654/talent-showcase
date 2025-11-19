import { UserRole } from "src/users/Entity/user.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('user_waiting')

export class User_otp {
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

    @Column({ nullable: true })
    avatar_url: string;

    @Column({ default: false })
    is_active: boolean;

    @Column({ nullable: true, select: false })
    otp: string ;

    @Column({ type: 'timestamp', nullable: true })
    otp_expires_at: Date ;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

}

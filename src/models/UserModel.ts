import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
    PrimaryColumn,
} from 'typeorm';
import { IsNotEmpty, Length, IsIP, IsOptional } from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { ValidationEntity } from '../database';
import { HttpError } from 'routing-controllers';

@Entity({ name: 'user' })
export class UserModel extends ValidationEntity {
    @IsNotEmpty()
    @Length(5, 50)
    @PrimaryColumn({ length: 50 })
    id: string;

    @IsNotEmpty()
    @Length(3, 20)
    @Column({ length: 20 })
    name: string;

    @IsNotEmpty()
    @Column()
    password: string;

    @Column({ length: 10, default: '' })
    auth: string;

    @Column({ length: 5, default: 'all' })
    factory: string;

    @Column({ nullable: true })
    phone: string;

    @IsOptional()
    @IsIP('4')
    @Column({ name: 'accessable_ip', default: '' })
    accessableIp: string;

    @CreateDateColumn({ name: 'created_at' })
    createAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updateAt: Date;

    @BeforeUpdate()
    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch (e) {
            throw new HttpError(500, e.message);
        }
    }

    async comparePassword(unencryptedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(unencryptedPassword, this.password);
        } catch (e) {
            return false;
        }
    }
}

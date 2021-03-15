import { Column, Entity } from 'typeorm';
import { DBBaseEntity } from '.';

@Entity({ name: 'user' })
export class DBUser extends DBBaseEntity {
    @Column({ nullable: false })
    username: string;

    @Column({ select: false, nullable: false })
    password?: string;

    @Column({ default: false, nullable: false })
    locked: false;
}

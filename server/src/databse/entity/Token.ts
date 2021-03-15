import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { DBBaseEntity, DBUser } from '.';

@Entity({ name: 'token' })
export class DBToken extends DBBaseEntity {
    @Column({ nullable: false })
    token: string;

    @OneToOne(() => DBUser, { nullable: false, cascade: true })
    @JoinColumn()
    user: DBUser;
}

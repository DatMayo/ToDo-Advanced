import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DBBaseEntity, DBUser } from '.';

@Entity({ name: 'todo' })
export class DBToDo extends DBBaseEntity {
    @Column({ nullable: false })
    terminalId: number;

    @Column({ nullable: false })
    branch: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    zip: number;

    @Column({ nullable: false })
    town: string;

    @Column({ nullable: true, default: '' })
    image: string;

    @Column({ default: false, type: 'bool' })
    isFinished: boolean;

    @ManyToOne(() => DBUser, (user: DBUser) => user.id, { nullable: false })
    @JoinColumn()
    createdBy: DBUser;
}

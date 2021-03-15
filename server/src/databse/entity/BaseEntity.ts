import { BeforeInsert, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';

export class DBBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'datetime',
        nullable: false,
        readonly: true,
    })
    @Type(() => Date)
    createdAt: Date;

    @Column({
        type: 'datetime',
        nullable: false,
    })
    @Type(() => Date)
    updatedAt: Date;

    @BeforeInsert()
    insertDate() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // @BeforeUpdate()
    // updateDate() {
    //     this.updatedAt = new Date();
    // }
}

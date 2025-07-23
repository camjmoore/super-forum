import { User } from './User';
import { ThreadItem } from './ThreadItem';
import { Auditable } from './Auditable';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'ThreadItemPoints' })
export class ThreadItemPoint extends Auditable {
  @PrimaryGeneratedColumn({ name: 'ThreadItemPoint', type: 'bigint' })
  id: string;

  @Column('boolean', { name: 'IsDecrement', default: false, nullable: false })
  isDecrement: boolean;

  @ManyToOne(() => User, (user) => user.threadItemPoints)
  user: User;

  @ManyToOne(() => ThreadItem, (threadItem) => threadItem.threadItemPoints)
  threadItem: ThreadItem;
}

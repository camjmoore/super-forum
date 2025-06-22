import { ThreadItemPoint } from "./ThreadItemPoint";
import { Thread } from "./Thread";
import { User } from "./User";
import { Auditable } from "./Auditable";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "ThreadItems" })
export class ThreadItem extends Auditable {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string

  @Column("int", { name: "Views", default: 0, nullable: false })
  views: number

  @Column("boolean", { name: "IsDisabled", default: false, nullable: false })
  isDisabled: boolean

  @Column("varchar", { name: "Body", length: 2500, nullable: true})
  @Length(10, 2500)
  body: string

  @ManyToOne(() => User, (user) => user.threadItems)
  user: User

  @ManyToOne(() => Thread, (thread) => thread.threadItems)
  thread: Thread

  @OneToMany(() => ThreadItemPoint, (threadItemPoint) => threadItemPoint.user)
  threadItemPoints: ThreadItemPoint[]
}

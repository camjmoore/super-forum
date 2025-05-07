import { ThreadItemPoint } from "./ThreadItemPoint";
import { Thread } from "./Thread";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "ThreadItems" })
export class ThreadItem {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string

  @Column("int", { name: "Views", default: 0, nullable: false })
  views: number

  @Column("boolean", { name: "IsDisabled", default: false, nullable: false })
  isDisabled: boolean

  @Column("varchar", { name: "Body", length: 2500, nullable: true})
  @Length(10, 2500)
  body: string

  @ManyToOne(() => Thread, (thread) => thread.threadItems)
  thread: Thread

  @OneToMany(() => ThreadItemPoint, (threadItemPoint) => threadItemPoint.user)
  threadItemPoints: ThreadItemPoint[]
}

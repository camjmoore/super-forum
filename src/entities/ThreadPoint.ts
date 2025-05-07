import { User } from "./User";
import { Thread } from "./Thread";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "ThreadPoints"})
export class ThreadPoint {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string

  @Column("boolean", { name: "IsDecrement", default: false, nullable: false })
  isDecrement: boolean

  @ManyToOne(() => User, (user) => user.threadpoints)
  user: User

  @ManyToOne(() => Thread, (thread) => thread.threadpoints)
  thread: Thread
}

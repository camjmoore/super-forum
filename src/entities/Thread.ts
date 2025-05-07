import { User } from "./User";
import { ThreadPoint } from "./ThreadPoint";
import { ThreadItem } from "./ThreadItem";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Length } from "class-validator";

@Entity({ name: "Threads"})
export class Thread {
  @PrimaryGeneratedColumn({ name: "Id", type: "bigint" })
  id: string

  @Column("int", { name: "Views", default: 0, nullable: false })
  views: number

  @Column("boolean", { name: "IsDisabled", default: false, nullable: false })
  isDisabled: boolean

  @Column("varchar", { name: "Title", length: 150, nullable: false })
  @Length(5, 150)
  title: string


  @Column("varchar", { name: "Body", length: 2500, nullable: true })
  @Length(10, 2500)
  body: string

  @ManyToOne(() => User, (user) => user.threads)
  user: User

  @OneToMany(() => ThreadItem, (threadItem) => threadItem.thread)
  threadItems: ThreadItem[]

  @OneToMany(() => ThreadPoint, (threadPoints) => threadPoints.thread)
  threadPoints: ThreadPoint[]
}


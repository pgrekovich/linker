import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { User } from './User'

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  originalUrl!: string

  @Column()
  shortenedUrl!: string

  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  user!: User

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}

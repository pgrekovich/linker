import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany
} from 'typeorm'
import { Link } from './Link'

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @OneToMany(() => Link, (link) => link.user)
  links!: Link[]
}

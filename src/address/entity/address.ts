import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "../../models/index";

@Entity({name:"addresses"})
export class Address {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  street?: string;

  @Column()
  city?: string;

  @Column()
  phone?: string;

  @Column()
  name?: string;

  @Column({ name: "is_default" })
  isDefault?: boolean;

  @ManyToOne(() => User, (user) => user.userAddresses)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;
}

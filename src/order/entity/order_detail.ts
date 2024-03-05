import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User, OrderItem, Address } from "../../models/index";

@Entity({name: "order_details"})
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("double")
  total?: number;

  @Column({ name: "ship_method" })
  shipMethod?: string;

  @Column({ name: "mode_pay" })
  modePay?: string;

  @Column()
  status!: string;

  @Column()
  note?: string;

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;

  @ManyToOne(() => User, (user) => user.userOders)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.order)
  orderItems?: OrderItem[];

  @OneToOne(() => Address)
  @JoinColumn({
    name: "address_id",
    referencedColumnName: "id",
  })
  address?: Address;

  // @OneToMany(() => Transaction, (userTransactions) => userTransactions.order)
  // userTransactions?: Transaction[];
}

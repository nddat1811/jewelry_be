import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./index";

@Entity({name: "user_payments"})
export class UserPayment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "payment_type" })
  paymentType?: string;

  @Column()
  provider?: string;

  @Column({ name: "account_no" })
  accountNo?: number;

  @Column()
  expiry?: Date;

  @Column({ name: "is_default" })
  isDefault?: boolean;

  @ManyToOne(() => User, (user) => user.userPayments)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;
}

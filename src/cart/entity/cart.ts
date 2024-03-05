import {
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { User, CartItem } from "../../models/index";

@Entity({name: "carts"})
export class Cart {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;

  @OneToMany(() => CartItem, (cartItems) => cartItems.cart)
  cartItems?: CartItem[];
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Product, Cart } from "../../../models/index";

@Entity({name: "cart_items"})
export class CartItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column("double")
  price!: number;

  @Column({ name: "created_at" })
  createdAt?: Date;

  @Column({ name: "updated_at" })
  updatedAt?: Date;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product?: Product;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({
    name: "cart_id",
    referencedColumnName: "id",
  })
  cart?: Cart;
}

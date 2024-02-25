import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";

@Entity({name: "product_discounts"})
export class ProductDiscount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name?: string;

  @Column()
  description?: string;

  @Column()
  active?: boolean;

  @Column({ name: "discount_percent" })
  discountPercent?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @OneToMany(() => Product, (products) => products.discount)
  products?: Product[];
}

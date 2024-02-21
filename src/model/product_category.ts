import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Product } from "./product";


@Entity({name: "product_categories"})
export class ProductCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code?: string;

  @Column()
  name?: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt?: Date;

  @Column({
    name: "deleted_at",
    type: "boolean", // Use a supported data type (e.g., boolean)
    nullable: true, // Ensure it allows null values if needed
  })
  deletedAt?: boolean | null;

  @OneToMany(() => Product, (product) => product.category, { eager: true })
  products?: Product[];
}

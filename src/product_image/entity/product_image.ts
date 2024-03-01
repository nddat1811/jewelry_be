import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from "typeorm";
import { Product } from "../../product/entity/product";

@Entity({ name: "product_images" })
export class ProductImage {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "image_url" })
  url?: string;

  @CreateDateColumn({
    name: "created_at",
  })
  createdAt?: Date;

  @UpdateDateColumn({
    name: "updated_at",
  })
  updatedAt?: Date;

  @ManyToOne(() => Product, (product) => product.images)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product?: Product;
}

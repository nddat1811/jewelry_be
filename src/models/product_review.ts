import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { Product, User } from "./index";

@Entity({name: "product_reviews"})
export class ProductReview {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  content?: string;

  @Column()
  like?: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @Column({
    name: "deleted_at",
    type: "boolean", // Use a supported data type (e.g., boolean)
    nullable: true, // Ensure it allows null values if needed
  })
  deletedAt?: boolean | null;

  @ManyToOne(() => Product, (product) => product.productReviews)
  @JoinColumn({
    name: "product_id",
    referencedColumnName: "id",
  })
  product?: Product;

  @OneToOne(() => ProductReview)
  @JoinColumn({ name: "parent_review", referencedColumnName: "id" })
  parentReview?: ProductReview;

  @ManyToOne(() => User, (user) => user.productReviews)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id",
  })
  user?: User;
}

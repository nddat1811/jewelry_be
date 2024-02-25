import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";
import {
  ProductCategory,
  ProductInventory,
  ProductReview,
  CartItem,
  OrderItem,
  ProductDiscount,
} from "../../models/index";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  code?: string;

  @Column()
  name?: string;

  @Column()
  images?: string;

  @Column()
  origin?: string;

  @Column()
  material?: string;

  @Column()
  size!: string;

  @Column()
  warranty?: string;

  @Column()
  description?: string;

  @Column("double")
  price!: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt?: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt?: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: boolean | null;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  @JoinColumn({
    name: "category_id",
    referencedColumnName: "id",
  })
  category?: ProductCategory;

  @OneToOne(() => ProductInventory)
  @JoinColumn({
    name: "inventory_id",
    referencedColumnName: "id",
  })
  inventory?: ProductInventory;

  @OneToMany(() => ProductReview, (productReviews) => productReviews.product)
  productReviews?: ProductReview[];

  @OneToMany(() => CartItem, (cartItems) => cartItems.product)
  cartItems?: CartItem[];

  @OneToMany(() => OrderItem, (orderItems) => orderItems.product)
  orderItems?: OrderItem[];

  @ManyToOne(() => ProductDiscount, (discount) => discount.products)
  @JoinColumn({
    name: "discount_id",
    referencedColumnName: "id",
  })
  discount?: ProductDiscount;
}

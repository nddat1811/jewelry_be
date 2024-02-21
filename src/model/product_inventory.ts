import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({name: "product_inventories"})
export class ProductInventory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity?: number;

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
}

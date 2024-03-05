import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { OrderItemDto } from "../order_item/dto/order_item.dto";

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  items!: OrderItemDto[];

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: "Total must be a valid number" }
  )
  total!: number;

  @IsString()
  shipMethod!: string;

  @IsString()
  modePay!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsNumber()
  addressId!: number;
}

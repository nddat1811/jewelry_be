import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @IsNumber()
  product_id!: number;

//   @IsNumber()
//   size!: number;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  price!: number;
}

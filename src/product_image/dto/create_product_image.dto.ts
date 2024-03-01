import { IsNumber, IsOptional, IsString  } from "class-validator";

export class CreateProductImageDto {
  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsNumber()
  productId?: number;
}

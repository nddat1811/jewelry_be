import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsNumberString,
} from "class-validator";

export class CreateProductDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  origin?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  warranty?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumberString()
  price!: number;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  discountId?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  inventoryId?: number;

  @IsOptional()
  @IsBoolean()
  deletedAt?: boolean;
}

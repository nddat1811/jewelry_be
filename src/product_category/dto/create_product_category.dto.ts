import { IsOptional, IsString  } from "class-validator";

export class CreateProductCategoryDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsString()
  name!: string;
}

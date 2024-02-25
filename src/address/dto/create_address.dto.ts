import { IsString, IsOptional, IsDate, IsNotEmpty, IsArray, ArrayMinSize, ValidateNested, IsBoolean } from 'class-validator';

class CreateAddressDto {
  @IsString()
  @IsNotEmpty()
  street?: string;

  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export default CreateAddressDto;

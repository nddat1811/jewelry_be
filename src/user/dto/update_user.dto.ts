import { IsNotEmpty, IsOptional, IsString, IsNumber, IsBoolean, IsDate } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  role?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  // @IsString()
  // email!: string; //can not update email

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsDate()
  dob?: Date; //undefined

  @IsOptional()
  @IsDate()
  gender?: string;
}

export class UpdateUserPassword {
  @IsString()
  oldPassword!: string;

  @IsString()
  newPassword!: string;
}

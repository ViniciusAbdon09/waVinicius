import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { IOrder } from 'modules/database/interfaces/order';

export class SaveValidator implements IOrder {
  @IsInt()
  @Min(0)
  @IsOptional()
  @ApiProperty({ required: false, type: 'integer' })
  public id?: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'double' })
  public value: number;
  
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'integer' })
  public quantity: number;

  @MaxLength(250)
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true, type: 'string', minLength: 3, maxLength: 250 })
  public description: string;
}

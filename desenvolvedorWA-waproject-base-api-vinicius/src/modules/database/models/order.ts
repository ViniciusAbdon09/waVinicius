import { ApiProperty } from '@nestjs/swagger';
import { Model } from 'objection';

import { IOrder } from '../interfaces/order';

export class Order extends Model implements IOrder {
  @ApiProperty({ type: 'integer' })
  public id: number;
  
  @ApiProperty({ type: 'double' })
  public value: number;

  @ApiProperty({ type: 'integer' })
  public quantity: number;
  
  @ApiProperty({ type: 'string' })
  public description: string;

  public static get tableName(): string {
    return 'Order';
  }
}

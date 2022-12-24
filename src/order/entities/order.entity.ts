import { IsEnum } from 'class-validator';
import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table({ tableName: 'Orders' })
export class Order extends Model {
  @Column({ type: DataType.INTEGER })
  clientId: number;

  @Column({ type: DataType.INTEGER })
  delivererId: number;

  @Column({ type: DataType.STRING(50) })
  name: string;

  @Column({ type: DataType.INTEGER })
  quantity: number;

  @Column({ type: DataType.STRING(50) })
  description: string;

  @Column({ type: DataType.DECIMAL })
  pickupLocLongitude: number;

  @Column({ type: DataType.DECIMAL })
  pickupLocLatitude: number;

  @Column({ type: DataType.DECIMAL })
  dropoffLocLongitude: number;

  @Column({ type: DataType.DECIMAL })
  dropoffLocLatitude: number;

  @Column({ type: DataType.STRING })
  @IsEnum(['wait for deliverer', 'on the way', 'submitted'])
  state: string;

  @Column({ type: DataType.DATE })
  submittedAt: Date;
}

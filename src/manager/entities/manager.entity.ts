import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table({ tableName: 'Managers' })
export class Manager extends Model {
  @Column({ type: DataType.STRING(50) })
  fullName: string;

  @Column({ type: DataType.STRING(50) })
  email: string;

  @Column({ type: DataType.BIGINT })
  phone_number: number;

  @Column({ allowNull: false })
  password: string;
}

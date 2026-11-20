import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import type { OrderStatus } from '../entities/order.entity.js';

export const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'cooking',
  'ready',
  'completed',
];

export class CreateOrderDto {
  @IsString()
  @MinLength(2, { message: 'Nama pelanggan minimal 2 karakter' })
  customerName: string;

  @IsString()
  @MinLength(2, { message: 'Nama menu minimal 2 karakter' })
  menuName: string;

  @IsInt({ message: 'Jumlah porsi harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah porsi minimal 1' })
  quantity: number;

  @IsInt({ message: 'Total harga harus berupa bilangan bulat' })
  @Min(0, { message: 'Total harga tidak boleh negatif' })
  totalPrice: number;

  @IsBoolean()
  @IsOptional()
  isTakeaway?: boolean;

  @IsIn(ORDER_STATUSES, {
    message: 'Status harus salah satu dari: pending, cooking, ready, completed',
  })
  @IsOptional()
  status?: OrderStatus;

  @IsDateString({}, { message: 'Format orderDate harus berupa ISO date string' })
  @IsOptional()
  orderDate?: string;

  @IsString()
  @IsOptional()
  tableNumber?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  itemsSummary?: string[];

  @IsString()
  @IsOptional()
  spiceLevel?: string;

  @IsString()
  @IsOptional()
  kitchenNote?: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;
}

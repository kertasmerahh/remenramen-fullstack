import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';
import { Order } from './entities/order.entity.js';

@Injectable()
export class OrdersService {
  private orders: Order[] = [
    {
      id: 1,
      customerName: 'Budi Santoso',
      menuName: 'Tantan Ramen',
      quantity: 1,
      totalPrice: 25000,
      isTakeaway: false,
      status: 'cooking',
      orderDate: '2026-11-20T12:00:00.000Z',
      tableNumber: 'Meja 04',
      itemsSummary: [
        '1x Tantan Ramen (Rp 15.000)',
        '1x Chicken Katsu (+Rp 7.000)',
        '1x Es Teh Manis (+Rp 3.000)',
      ],
      spiceLevel: 'Level 2',
      kitchenNote: 'Daun bawang dibanyakin',
      paymentMethod: 'Tunai',
    },
    {
      id: 2,
      customerName: 'Siti Rahma',
      menuName: 'Abura Soba',
      quantity: 2,
      totalPrice: 40000,
      isTakeaway: false,
      status: 'ready',
      orderDate: '2026-11-20T12:10:00.000Z',
      tableNumber: 'Meja 02',
      itemsSummary: [
        '2x Abura Soba (Rp 30.000)',
        '2x Matcha Ice (+Rp 10.000)',
      ],
      spiceLevel: 'Level 3 & 1',
      kitchenNote: 'Kuah dipisah',
      paymentMethod: 'QRIS Lunas',
    },
    {
      id: 3,
      customerName: 'Mas Agus',
      menuName: 'Tantan Ramen',
      quantity: 1,
      totalPrice: 20000,
      isTakeaway: false,
      status: 'pending',
      orderDate: '2026-11-20T12:15:00.000Z',
      tableNumber: 'Meja 07',
      itemsSummary: [
        '1x Tantan Ramen (Rp 15.000)',
        '1x Lemon Tea (+Rp 5.000)',
      ],
      spiceLevel: 'Level 0',
      kitchenNote: '',
      paymentMethod: 'Belum Bayar',
    },
  ];

  private nextId = 4;

  create(createOrderDto: CreateOrderDto): Order {
    const duplicatePending = this.orders.find(
      (order) =>
        order.customerName.toLowerCase() ===
          createOrderDto.customerName.trim().toLowerCase() &&
        order.menuName.toLowerCase() ===
          createOrderDto.menuName.trim().toLowerCase() &&
        order.status === 'pending',
    );

    if (duplicatePending) {
      throw new ConflictException(
        `Pelanggan "${createOrderDto.customerName}" sudah memiliki pesanan "${createOrderDto.menuName}" dengan status pending`,
      );
    }

    const newOrder: Order = {
      id: this.nextId++,
      customerName: createOrderDto.customerName.trim(),
      menuName: createOrderDto.menuName.trim(),
      quantity: createOrderDto.quantity,
      totalPrice: createOrderDto.totalPrice,
      isTakeaway: createOrderDto.isTakeaway ?? false,
      status: createOrderDto.status ?? 'pending',
      orderDate: createOrderDto.orderDate ?? new Date().toISOString(),
      tableNumber: createOrderDto.tableNumber,
      itemsSummary: createOrderDto.itemsSummary,
      spiceLevel: createOrderDto.spiceLevel,
      kitchenNote: createOrderDto.kitchenNote,
      paymentMethod: createOrderDto.paymentMethod,
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  findAll(): Order[] {
    return this.orders;
  }

  findOne(id: number): Order {
    const order = this.orders.find((item) => item.id === id);
    if (!order) {
      throw new NotFoundException(`Order dengan id ${id} tidak ditemukan`);
    }
    return order;
  }

  update(id: number, updateOrderDto: UpdateOrderDto): Order {
    const order = this.findOne(id);
    Object.assign(order, updateOrderDto);
    return order;
  }

  remove(id: number): { message: string; deleted: Order } {
    const index = this.orders.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new NotFoundException(`Order dengan id ${id} tidak ditemukan`);
    }
    const [deleted] = this.orders.splice(index, 1);
    return {
      message: `Order #${id} berhasil dihapus`,
      deleted,
    };
  }
}

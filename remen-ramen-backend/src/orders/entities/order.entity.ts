export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed';

export class Order {
  id: number;
  customerName: string;
  menuName: string;
  quantity: number;
  totalPrice: number;
  isTakeaway: boolean;
  status: OrderStatus;
  orderDate: string;

  // Field opsional sinkronisasi frontend Remen Ramen
  tableNumber?: string;
  itemsSummary?: string[];
  spiceLevel?: string;
  kitchenNote?: string;
  paymentMethod?: string;
}

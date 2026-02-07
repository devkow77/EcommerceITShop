import { useState } from "react";
import OrderCard from "./OrderCard";

interface OrderItemType {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
    slug: string;
  };
}

interface OrderType {
  id: number;
  userId: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELED";
  createdAt: string;
  items: OrderItemType[];
}

interface OrdersListProps {
  orders: OrderType[];
  onOrderCanceled?: () => void;
}

const OrdersList = ({ orders, onOrderCanceled }: OrdersListProps) => {
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          isExpanded={expandedOrderId === order.id}
          onToggleExpand={() =>
            setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
          }
          onOrderCanceled={onOrderCanceled}
        />
      ))}
    </div>
  );
};

export default OrdersList;
